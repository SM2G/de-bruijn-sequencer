var app = angular.module('de-bruijn', []);
////////////////////////////////////////////////////////////////////////////////
app.controller('FormController', function () {
    this.k = "1 2 3 A";
    this.n = 5;

    this.reset = function() {
        this.k = "1 2 3 A";
        this.n = 5;
    };

    this.deBrujin = function(k, n) {
        //alert("K = " + k + " and N = " + n);
        karray = [];
        karray = k.split(" ");
        output = "";
        if (karray.length < 2) {
            // Not enough data
            output = "<p class='text-success'>Not</p> enough values. ("+ karray.length +" values, min 2)";
        } else {
            //Table
            table = "<ul class=\"list-group\">";
            for(i = 0 ; i < karray.length ; i++) {
                table = table + "<li class=\"list-group-item\"><span class=\"badge\">"
                + karray[i]  + " </span> Element " + i + "</li>";
            }
            table = table + "</ul>"

            //De Bruijn sequence for alphabet size k (0,1,2...k-1)
            //and subsequences of length n.
            //From wikipedia Sep 22 2013
            function db(k, n) {
                var a = [];
                for (var i = 0; i < k * n; i++) a.push(0);

                var sequence = [];
                (function db (t, p) {
                    if (t > n) {
                        if (n % p !== 0) return;
                        for (var j = 1; j <= p; j++) {
                            sequence.push(a[j]);
                        }
                        return;
                    }

                    a[t] = a[t-p];
                    db(t + 1, p);
                    for (var j = a[t-p] + 1; j < k; j++) {
                        a[t] = j;
                        db(t + 1, t);
                    }
                })(1,1);
                return sequence;
            };

            var output = "K length is " + karray.length +
            ", N is " + n;
        }
        var sequence = db(karray.length, n);
        document.getElementById('solution').innerHTML = table + output + "</br>"
        + sequence.join('');
    };

});