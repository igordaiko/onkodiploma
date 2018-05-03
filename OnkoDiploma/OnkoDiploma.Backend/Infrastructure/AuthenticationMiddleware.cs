using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Principal;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Net.Http.Headers;
using Onko.Core.Impl;

namespace OnkoDiploma.Infrastructure
{
    public static class AuthenticationMiddleware
    {
        public static IApplicationBuilder UseAuth(this IApplicationBuilder app)
        {
            return app.Use(async (context, next) =>
            {
                var session = context.RequestServices.GetService<Session>();

                var request = context.Request;

                var tokenBase64 = GetTokenFromHeaders(request)
                    ?? request.Cookies[AccessTokenName]
                    ?? request.Query[AccessTokenName].ToString();

                byte[] token;
                try
                {
                    token = Convert.FromBase64String(tokenBase64);
                }
                catch
                {
                    token = null;
                }

                var loggedIn = session.LogIn(token);

                if (!loggedIn && !_publicPattern.IsMatch(request.Path.Value))
                {
                    if (_doNotRedirect.IsMatch(request.Path.Value))
                    {
                        context.Response.StatusCode = (int)HttpStatusCode.Forbidden;
                    }
                    else
                    {
                        var redirectUrl = new StringBuilder("/login");

                        if (request.Path != "/")
                            redirectUrl.Append("?").Append(Uri.EscapeDataString(request.Path));

                        context.Response.Redirect(redirectUrl.ToString());
                    }

                    return;
                }

                if (loggedIn)
                    context.User = new GenericPrincipal(new GenericIdentity(session.Identity), new string[0]);

                await next();
            });
        }

        public static string GetTokenFromHeaders(HttpRequest request)
        {
            var values = request.Headers[HeaderNames.Authorization];

            return values.Count == 0 ? null : (
                    from value in values
                    select value.Split(new[] { ' ' }, 2, StringSplitOptions.RemoveEmptyEntries)
                    into parts
                    where parts.Length == 2 && parts[0] == AccessTokenType
                    select parts[1]
                )
                .FirstOrDefault();
        }

        // todo: !!! move to configuration
        private const string AccessTokenType = "bearer";

        // todo: !!! move to configuration
        private const string AccessTokenName = "access_token";

        // todo: !!! move to configuration
        private static readonly Regex _publicPattern =
            new Regex(@"^\/(login(\/|\.[\w\d]+)?|api\/auth\/login|api\/auth\/register|api\/auth\/checkmail|api\/auth\/emailconfirmation|api\/auth\/mergeaccounts)$",
                RegexOptions.Compiled);

        private static readonly Regex _doNotRedirect = new Regex(@"^\/api\/", RegexOptions.Compiled);
    }
}
