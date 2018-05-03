using System.Collections.Generic;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.FileProviders;

namespace OnkoDiploma.Infrastructure
{
    public static class RewriteMiddleware
    {
        public static IApplicationBuilder UseUrlRewrites(this IApplicationBuilder app, IFileProvider fileProvider)
        {
            return app.Use(async (context, next) =>
            {
                var path = context.Request.Path.Value;

                if (!_ignores.IsMatch(path) && !fileProvider.GetFileInfo(path).Exists)
                {
                    if (!_rewrites.TryGetValue(path, out string rewrite))
                        rewrite = DefaultRewrite;

                    context.Request.Path = new PathString(rewrite);
                }

                await next();
            });
        }

        // todo: !!! move to configuration
        private const string DefaultRewrite = "/index.html";

        // todo: !!! move to configuration
        private static readonly Dictionary<string, string> _rewrites = new Dictionary<string, string>
        {
            { "/login", "/login.html" },
            { "/login/", "/login.html" }
        };

        // todo: !!! move to configuration
        private static readonly Regex _ignores = new Regex(@"^\/api\/", RegexOptions.Compiled);
    }
}
