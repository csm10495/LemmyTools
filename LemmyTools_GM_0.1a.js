// ==UserScript==
// @name         LemmyTools
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A small suite of tools to make Lemmy easier.
// @author       howdy@thesimplecorner.org
// @match        https://*/*
// ==/UserScript==



const homeString = `
// !!! - EDIT YOUR HOME INSTANCE HERE - !!! 
const theHomeinstance = 'https://thesimplecorner.org';
// !!! -------------------------------- !!!


/* LemmyTools 0.1a - greasemonkey addon release

Current Features:
- Adds "Easy Subscribe" button to remote instance communities.
- Adds a collapsable sidebar on the left side of screen that shows 
a searchable list of your subscribed communities. 
- Adds link back to home instance for easy navigation when on remote
instances.
- Remote instance side bar is very much useless currently

Upocoming features:

- When off site collect a list of communities and display in sidebar
for easy subscription.
- Create option page for saving homeinstance and other options.
- Create sub communities grouping function.
- Create remote instance search of communities and integrate with
easy subscribe method.
- create firefox addon.

/* ---------------------- */
`;



/* SCRIPT BELOW */

const funcsString = `
function update(comm, page, subString) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log("LemmyTools: " + "update()" + subString);
      document.querySelectorAll('[role="alert"]').forEach(function(el) {
        el.innerHTML += "<br /><br /><a href=" + subString + " target='_blank'><button class='ltbutton'>Easy Subscribe</button></a>";
      });

/*
      let commPageArray = [];
      let remoteLinks = [];
      if (url.includes("/communities")) {
        document.querySelectorAll('[class="overflow-wrap-anywhere"]').forEach(function(el) {
          commPageArray.push(el.innerText);
        });
        if (commPageArray.count > 1)
        {
        console.log("LemmyTools: " + "setting remoteComms to localstore");
        localStorage.setItem("remoteComms", commPageArray);
        site = site.replace("/communities", "");
        for (const comm of commPageArray) {
          var subString = homeInstance + "/search/q/!" + comm + "@" + site + "/type/All/sort/TopAll/listing_type/All/community_id/0/creator_id/0/page/1";
          remoteLinks.push(subString);
          //div.innerHTML += comm + "<br /><a href=" + subString + " target='_blank'><button class='ltbutton'>Easy Subscribe</button></a><hr />";
        }
          console.log("LemmyTools: " + "setting remoteLinks to localstore");
      localStorage.setItem("remoteLinks", remoteLinks);
      }
      
      }
*/
    }
  }
  xhttp.open("GET", page, true);
  xhttp.send(page);
}

function commupdate(id, page, data) {
  var count = -1;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log("LemmyTools: " + "updating " + id + " commsearch with: " + data);
      data.forEach(_ => count++);
      id.innerHTML = "";
      id.innerHTML += "Results: " + count + "<hr />";
      id.innerHTML += data;
    }
  }
  xhttp.open("GET", page, true);
  xhttp.send(page);
}



function Toggle(overide) {

	
  var s = document.getElementById("searchdiv");
  var size = s.getBoundingClientRect();
  var x = document.getElementById("myDiv");
  var b = document.getElementById("toggle");

//on remote instance just hide the bar.
  if (overide = 0)
{
x.style.display = "none";
}


  if (x.style.display === "none") {
    x.style.display = "block";
    b.innerHTML = "<<";
    s.style.left = "0%";
  } else {
    x.style.display = "none";
    b.innerHTML = ">>";

		if (size.width > 261)
{
    s.style.left = "-7.33%";
}
		else
{
          s.style.left = "-200px";
}
}

}

function searchComms(id, full, commsdiv) {
  var url = window.location.href;
  var query = id.value.toLowerCase();
  console.log("LemmyTools: " + "Searching for:" + query)
  if (query == "") {
    commsdiv.innerHTML = full;
  } else {
    commsdiv.innerHTML = full;
    var children = commsdiv.getElementsByTagName("li"); // any tag could be used here..
    console.log("LemmyTools: " + "Children found: " + children.length);
    let data = [""];
    var found;
    for (var i = 0; i < children.length; i++) {
      if (children[i].innerHTML.toLowerCase().indexOf(query) !== -1) {
        found = children[i].innerHTML + "<hr />";
        console.log("LemmyTools: " + "Found " + query + " in " + found);
        data.push(found);
      }
    }
    let dup = [...new Set(data)];
    data = dup;
    data.sort();
    commupdate(commsdiv, url, data);
  }
}


// One liner function:
 const addCSS = css => document.head.appendChild(document.createElement("style")).innerHTML = css;

// Usage: 
 addCSS(".ltmenu {position: fixed; min-width: 240px; width: 8%; max-height: 7%; top: 0; left: 0; font-size: .75em; overflow: hidden; display: block; min-height:80px; }" + ".ltcommsbar {position: fixed; min-width: 240px; width: 8%; word-wrap: break-word; max-height: 93%; min-height:93%; top: 80px; left: 0; font-size: .75em; overflow: auto; display: block; }" + ".ltbutton {background-color: #ccffe5;}");


`;




const mainString = `
// LemmyTools
/* EDIT YOUR HOME INSTANCE */
var homeInstance = theHomeinstance;
/* ---------------------- */



/* Script */
var url = window.location.href;
var currentPage = url;
var broken = url.split('/c/');
var site = broken[0];
site = site.replace('https://', '');
var community = broken[1];
var subString = homeInstance + "/search/q/!" + community + "@" + site + "/type/All/sort/TopAll/listing_type/All/community_id/0/creator_id/0/page/1";
var count = 0;


//Easier Subscribe Buttons ---------------------------
//Browsing remote instance
setInterval(function() {
  url = window.location.href;
  if (currentPage != location.href) {
    broken = url.split('/c/');
    site = broken[0];
    site = site.replace('https://', '');
    community = broken[1];
    subString = homeInstance + "/search/q/!" + community + "@" + site + "/type/All/sort/TopAll/listing_type/All/community_id/0/creator_id/0/page/1";
    // page has changed, set new page as 'current'
    console.log("LemmyTools: " + "Easy Sub Running...");
    if (document.querySelector('meta[name="Description"]').content.includes("Lemmy")) {
      console.log("LemmyTools: " + "On lemmy");
      if ((url.includes(homeInstance) == false) && ((url.includes("/c/") || url.includes("/post/") || url.includes("/comment/") || url.includes("/communities")))) {
        console.log("LemmyTools: " + "On remote instance community" + "Button to: " + subString);
        update(community, url, subString);
      }
    }
  }
  currentPage = location.href;
}, 500);

// Direct to community
if (document.querySelector('meta[name="Description"]').content.includes("Lemmy")) {
  console.log("LemmyTools: " + "On lemmy");
  if ((url.includes(homeInstance) == false) && ((url.includes("/c/") || url.includes("/post/") || url.includes("/comment/") || url.includes("/communities")))) {
    console.log("LemmyTools: " + "On remote instance community - DIRECT -" + "Button to: " + subString);
    update(community, url, subString);
  }
}





//Better Subscription List --------------------------
//Build the divs
var idiv = document.createElement("div");
idiv.setAttribute("id", "searchdiv");
idiv.classList.add("ltmenu", "border-secondary", "card");
idiv.innerHTML = "<input type='text'  id='commsearch' placeholder='Sub search' oninput='searchComms(commsearch, communityArray, div)' /><br />LemmyTools<span style='float:right;'><button class='ltbutton' id='toggle' onClick='Toggle()'" + "style='float:right;'  /> << </button><br /><br /><b><a href=" + homeInstance + ">Home</a></b></span>";
var div = document.createElement("div");
div.setAttribute("id", "myDiv");
div.classList.add("ltcommsbar", "border-secondary", "card");
if (document.querySelector('meta[name="Description"]').content.includes("Lemmy")) {
  url = location.href;
  console.log("LemmyTools: " + "url is " + url)
  // -----------------------------------------------
  //Add divs to page;
  document.body.appendChild(idiv);
  document.body.appendChild(div);
}
var commsearch = document.getElementById("commsearch");
// -----------------------------------------------
let communityArray = new Array();
if (url.includes(homeInstance)) {
  console.log("LemmyTools: " + "home instance do bar");
  document.querySelectorAll('[class="list-inline-item d-inline-block"]').forEach(function(el) {
    communityArray.push("<li>" + el.innerHTML + "</li>");
  });
  let dup = [...new Set(communityArray)];
  communityArray = dup;
  if ((count == 0) || (count == null)) {
    count = 0;
    communityArray.forEach(_ => count++);
  }
  div.innerHTML = "Communities: " + count + "<hr />";
  div.innerHTML += communityArray;
  if (div.innerHTML.length >= 20) {
    //make use of it:
console.log("LemmyTools: Got Results >20");
    
      console.log("LemmyTools: " + "setting localcomms localstore");
      localStorage.setItem("localComms", communityArray);
   
  } else {
    console.log("LemmyTools: " + "get localcomms from localstore");
    communityArray = localStorage.getItem("localComms");
    div.innerHTML = "Communities: " + count + "<hr />"
    div.innerHTML += communityArray;
    searchComms(commsearch, communityArray, div);
  }
} else {
  console.log("LemmyTools: On Remote Instance - Bar");
  //div.innerHTML = localStorage.getItem("remoteComms");
	Toggle(0);
}
`;


const LTHome = document.head.appendChild(document.createElement("script")).innerHTML = homeString;
const LTFuncs = document.head.appendChild(document.createElement("script")).innerHTML = funcsString;
const LTMain = document.body.appendChild(document.createElement("script")).innerHTML = mainString;
