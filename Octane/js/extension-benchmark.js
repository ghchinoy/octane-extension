var completed = 0;
var benchmarks = BenchmarkSuite.CountBenchmarks();
var success = true;
var octaneResults;

function ShowBox(name) {
  var box = document.getElementById("Box-" + name);
  box.style.visibility = 'visible';
  var bar = document.getElementById("progress-bar").style.width = ""
      + ((++completed) / benchmarks) * 100 + "%";
}

function AddResult(name, result) {
  var box = document.getElementById("Result-" + name);
  box.innerHTML = result;
}

function AddError(name, error) {
  console.log(error);
  if (error == "TypedArrayUnsupported") {
    AddResult(name, '<b>Unsupported<\/b>');
  } else {
    AddResult(name, '<b>Error</b>');
  }
  success = false;
}

function AddScore(score) {
  var status = document.getElementById("main-banner");
  if (success) {
    status.innerHTML = "Octane Score: " + score;
  } else {
    status.innerHTML = "Octane Score (incomplete): " + score;
  }
  document.getElementById("progress-bar-container").style.visibility = 'hidden';
  document.getElementById("bottom-text").style.visibility = 'visible';
  document.getElementById("inside-anchor").removeChild(document.getElementById("bar-appendix"));
  document.getElementById("warning-header").style.visibility = 'hidden';
}

// previous in-line js
// Add a hook to append to json object (octaneResults) with tests, results
function Run() {
  document.getElementById("main-banner").innerHTML = "Running Octane...";
  // append the progress bar elements..
  document.getElementById("bar-appendix").innerHTML = "<br/><div class=\"progress progress-striped\" id=\"progress-bar-container\" style=\"visibility:hidden\"><div class=\"bar\"style=\"width: 0%;\" id=\"progress-bar\"></div></div>";
  var anchor = document.getElementById("run-octane");
  var parent = document.getElementById("main-container");
  parent.appendChild(document.getElementById("inside-anchor"));
  parent.removeChild(anchor);

  document.getElementById("startup-text").innerHTML="";

  document.getElementById("progress-bar-container").style.visibility = 'visible';

  BenchmarkSuite.RunSuites({
    NotifyStart : ShowBox,
    NotifyError : AddError,
    NotifyResult : AddResult,
    NotifyScore : AddScore
  });
}

function CheckCompatibility() {
  // If no Typed Arrays support, show warning label.
  var hasTypedArrays = typeof Uint8Array != "undefined"
      && typeof Float64Array != "undefined"
      && typeof (new Uint8Array(0)).subarray != "undefined";

  if (!hasTypedArrays) {
    console.log("Typed Arrays not supported");
    document.getElementById("warning-header").innerHTML = "Typed Arrays partly or not supported - some tests will be skipped";
  }
}

function Load() {
  setTimeout(CheckCompatibility, 200);
}

// Extension related behavior starts here

function ChromeVersion() {
  //full version as string:
  var chromeverstring = window.navigator.appVersion.match(/Chrome\/(.*?) /)[1];

  console.log("chrome version: " + chromeverstring);
  console.log(window.navigator.appVersion);

  document.querySelector('.chrome-ver').innerHTML = chromeverstring;
}

if (window.addEventListener) {
  window.addEventListener('load', Load(), false);
  window.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#run-octane').addEventListener('click', Run);
    ChromeVersion();
  });
} else {
  window.attachEvent('onload', Load());
}