using System;
using System.Collections.Generic;
using System.Text;
using LinqToDB.Mapping;

namespace Onko.Core.Contracts
{
    [Table("v_answer_result_stat")]
    public class Stats
    {
        [Column]
        public int StatsType { get; set; }

        [Column]
        public string Title { get; set; }

        [Column]
        public string GrTitle { get; set; }

        [Column]
        public string GrCode { get; set; }

        [Column]
        public DateTime DateDay { get; set; }

        [Column]
        public long Person { get; set; }
    }
}
