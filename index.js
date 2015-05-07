var dkroots = require('durand-kerner'),
    cpolyroots = require('poly-roots'),
    eigroots = require('companion-roots'),
    printf = require('printf');


var methods = [
  {
    name: 'Jenkins-Traub',
    method: cpolyroots,
    reversed: false
  }, {
    name: 'Durand-Kerner',
    method: dkroots,
    reversed: true
  }, {
    name: 'Companion Matrix',
    method: eigroots,
    reversed: true
  }
];

var cases = require('./cases.json');


// Greedy search search for the root they're supposed to be the error of:
function error( er, ei, or, oi ) {
  var hits = [];
  var i,j,idx,errmin,total = 0;
  for(i=0; i<er.length; i++) {
    idx = null;
    errmin = Infinity;
    for(j=0; j<er.length; j++) {
      if( hits.indexOf(j) !== -1 ) {
        continue;
      }
      var err = Math.pow(er[i]-or[j],2) + Math.pow(ei[i]-oi[j],2);
      if( err < errmin ) {
        idx = j;
        errmin = err;
      }
    }
    //console.log(errmin);
    hits.push(idx);
    total += errmin;
  }
  return Math.sqrt(total);
}

function time(name, callback, roots) {
  var t1, t2, avgtime=0, reps=100, solution,err;
  for(var i=0; i<reps; i++) {
    var t1 = process.hrtime();
    solution = callback();
    var t2 = process.hrtime(t1);
    avgtime += t2[0] + 1e-6*t2[1];
  }
  avgtime /= reps;


  if( solution[0] !== undefined ) {
    if( isNaN(solution[0][0]) ) {
      err = Infinity;
    } else {
      if( roots !== undefined ) {
        err = error( roots.real, roots.imag, solution[0], solution[1] );
        for(var j=0; j<solution[0].length; j++) {
          //console.log(solution[0][j], solution[1][j]);
        }
      }
    }
  } else {
    err = Infinity;
  }
  console.log(printf('%30s%17.5f ms%20.5e',name,avgtime,isNaN(err) ? Infinity : err));
}


console.log(printf('%30s%20s%20s','Method','Time','Error'));

var soln;
for(var j=0; j<cases.length; j++) {
  var kase = cases[j];

  console.log('\n'+kase.label+':');

  for(var i=0; i<methods.length; i++) {
    var name = methods[i].name;
    var method = methods[i].method;


    var re, im;
    if( methods[i].reversed ) {
      re = new Float64Array(kase.coeff.real.slice(0).reverse());
      im = new Float64Array(kase.coeff.imag.slice(0).reverse());
    } else {
      re = new Float64Array(kase.coeff.real);
      im = new Float64Array(kase.coeff.imag);
    }

    time(name, function() {
      return method(re,im);
    }, kase.roots );

  }
}
