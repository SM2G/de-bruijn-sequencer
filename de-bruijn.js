var app = angular.module('de-bruijn', []);
////////////////////////////////////////////////////////////////////////////////
app.controller('FormController', function () {
    this.k = "6 3 9 A";
    this.n = 4;

    this.reset = function() {
        this.k = "6 3 9 A";
        this.n = 4;
    };

    // Time estimate
    this.combinationLength = function (k, n) {
        solutionLength = 0;
        karray = [];
        karray = k.split(" ");
        solutionLength = (karray.length ** n * n);
        return solutionLength;
    };

    this.sequenceLength = function (k, n, limit) {
        solutionLength = 0;
        karray = [];
        karray = k.split(" ");
        if ( (karray.length ** n) > limit && limit != 0) {
            solutionLength = "Too long for manual ";
        } else {
            solutionLength = karray.length ** n;
        }
        return solutionLength;
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
                + karray[i]  + " </span> Element " + i + " is </li>";
            }
            table = table + "</ul>"

            // Replace
            function replace_all(solution, k){
                karray = [];
                karray = k.split(" ");
                for (i = 0 ; i < karray.length ; i++) {
                    solution = solution.replace(RegExp(i, "g"), karray[i]);
                }
                return solution;
            };

            // Format
            function format_solution(solution, n){
                var splitSolution = "<table class=\"table table-striped table-hover \">"
                + "<thead>"
                + "<tr>"
                + "<th>Solution ID</th>"
                + "<th>Code</th>"
                + "<th>Length</th>"
                + "</tr>"
                + "</thead>  <tbody>";
                var maxLength = solution.length;
                var currLine = "";
                var lineCounter = 1;
                var currentChar = "";
                var prevChar = "";
                for (i = 0 ; i < maxLength ; i++) {
                    // Preparing char
                    currentChar = solution.charAt(i);
                    prevChar = solution.charAt(i-1);
                    if ( currentChar === prevChar ) {
                        currentChar = "<span class=\"text-muted\">"
                            + currentChar
                            + " </span>";
                    } else {
                        currentChar = currentChar + " ";
                    }
                    if ( (i + 1) % n < 1 ) {
                        // Next input + End of line
                        currLine = currLine + currentChar;
                        splitSolution = splitSolution
                        + "<tr>"
                        + "<td class=\"text-primary\">" + lineCounter + "</td>"
                        + "<td>" + currLine + "</td>"
                        + "<td class=\"text-info\">" + (i+1) + "</td>"
                        + "</tr>";
                        currLine = "";
                        lineCounter +=1;
                    } else {
                        // Next input
                        currLine = currLine + currentChar;
                    }
                }
                if ( maxLength % n > 0 ){
                    splitSolution = splitSolution +
                    + "<tr>"
                    + "<td class=\"text-primary\">" + lineCounter + "</td>"
                    + "<td>" + currLine + "</td>"
                    + "<td class=\"text-info\">" + maxLength + "</td>"
                    + "</tr>";
                }
                splitSolution = splitSolution + "</tbody></table>";
                return splitSolution;
            };

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

            var output = "K length is "
            + karray.length
            + ", N is "
            + n
            + ', total length is '
            + db(karray.length, n).length + '. Duplicates are <em>highlighted</em>.';
        }

        var sequence = db(karray.length, n);
        var new_sequence = replace_all(sequence.join(''), k);
        var split_sequence = format_solution(new_sequence, n);

        // Solution Output
        document.getElementById('solution').innerHTML = output + "</br>"
        //+ new_sequence+ "</br>"
        + split_sequence;
    };

});
