
const maxTeilnehmer = 17


const courses = [

{id:"morning",name:"Morning Ride",date:"20.03.2026",time:"08:00"},
{id:"power",name:"Power Cycling",date:"20.03.2026",time:"18:00"},
{id:"endurance",name:"Endurance Ride",date:"21.03.2026",time:"10:30"},
{id:"afterwork",name:"After Work Ride",date:"21.03.2026",time:"19:00"},
{id:"beginner",name:"Beginner Ride",date:"22.03.2026",time:"17:30"},
{id:"hiit",name:"HIIT Cycling",date:"22.03.2026",time:"19:00"},
{id:"hill",name:"Hill Climb",date:"23.03.2026",time:"18:30"},
{id:"sprint",name:"Sprint Session",date:"24.03.2026",time:"18:00"},
{id:"tempo",name:"Tempo Ride",date:"24.03.2026",time:"19:30"},
{id:"recovery",name:"Recovery Ride",date:"25.03.2026",time:"17:30"},
{id:"evening",name:"Evening Burn",date:"25.03.2026",time:"19:00"},
{id:"weekend",name:"Weekend Challenge",date:"26.03.2026",time:"10:00"}

]


let currentUser = localStorage.getItem("cyclingUser")

if(!currentUser){

currentUser = prompt("Bitte gib deinen Namen ein")

localStorage.setItem("cyclingUser",currentUser)

}



function getTeilnehmer(kurs){

return JSON.parse(localStorage.getItem("kurs_"+kurs) || "[]")

}



function saveTeilnehmer(kurs,liste){

localStorage.setItem("kurs_"+kurs,JSON.stringify(liste))

}



const container = document.getElementById("courseContainer")
const tableBody = document.getElementById("courseTableBody")


courses.forEach(course => {

container.innerHTML += `

<div class="col-lg-4 col-md-6">

<div class="card shadow">

<div class="card-body">

<h5 class="card-title">${course.name}</h5>

<p>
📅 ${course.date}<br>
⏰ ${course.time}
</p>

<p class="text-muted" id="count-${course.id}"></p>

<button class="btn btn-primary w-100 mb-2 anmelden-btn"
data-kurs="${course.id}">
Anmelden
</button>

<div class="user-actions d-none" data-kurs="${course.id}">

<button class="btn btn-outline-danger w-100 mb-1 abmelden-btn"
data-kurs="${course.id}">
Abmelden
</button>

<small class="text-muted">
Abmeldung nur bis 24 Stunden vor Kursbeginn möglich
</small>

</div>

<a href="#"
class="teilnehmer-link"
data-bs-toggle="modal"
data-bs-target="#teilnehmerModal"
data-kurs="${course.id}"
data-name="${course.name}">
Teilnehmerliste
</a>

</div>

</div>

</div>


`

if(tableBody){
tableBody.innerHTML += `
<td id="mine-${course.id}">⬜</td>
<td><strong>${course.name}</strong></td>
<td>${course.date}</td>
<td>${course.time}</td>
<td id="table-count-${course.id}"></td>
<td id="status-${course.id}"></td>
<td><button class="btn btn-sm btn-primary anmelden-btn" data-kurs="${course.id}">Anmelden</button></td>
</tr>`
}

})



function updateCounts(){

courses.forEach(course=>{

const liste = getTeilnehmer(course.id)

const count = document.getElementById("count-"+course.id)

if(count)

count.innerText = liste.length + " / " + maxTeilnehmer + " Plätze belegt"

const tc=document.getElementById("table-count-"+course.id)
if(tc) tc.innerText=liste.length+"/"+maxTeilnehmer

const st=document.getElementById("status-"+course.id)
if(st){
 if(liste.length>=maxTeilnehmer) st.innerHTML='<span class="badge bg-danger">🔴 Voll</span>';
 else if(liste.length>=maxTeilnehmer-3) st.innerHTML='<span class="badge bg-warning text-dark">🟡 Fast voll</span>';
 else st.innerHTML='<span class="badge bg-success">🟢 Frei</span>';
}

const mine=document.getElementById("mine-"+course.id)
const row=document.getElementById("row-"+course.id)
if(mine){
 const me=liste.includes(currentUser)
 mine.innerHTML=me?"✅":"⬜"
 if(row){
   row.classList.toggle("table-success",me)
 }
}

})

}



function updateUserButtons(){

document.querySelectorAll(".user-actions").forEach(box=>{

const kurs = box.dataset.kurs

const liste = getTeilnehmer(kurs)

const card = document.getElementById("card-"+kurs)

if(liste.includes(currentUser)){

box.classList.remove("d-none")

if(card){
card.classList.add("card-angemeldet")
}

}else{

box.classList.add("d-none")

if(card){
card.classList.remove("card-angemeldet")
}

}

})

}



document.addEventListener("click",function(e){

if(e.target.classList.contains("anmelden-btn")){

const kurs = e.target.dataset.kurs

let liste = getTeilnehmer(kurs)

if(liste.includes(currentUser)){

alert("Du bist bereits angemeldet")

return

}

if(liste.length >= maxTeilnehmer){

alert("Kurs ist voll")

return

}

liste.push(currentUser)

saveTeilnehmer(kurs,liste)

updateCounts()

updateUserButtons()

}



if(e.target.classList.contains("abmelden-btn")){

const kurs = e.target.dataset.kurs

let liste = getTeilnehmer(kurs)

liste = liste.filter(name => name !== currentUser)

saveTeilnehmer(kurs,liste)

updateCounts()

updateUserButtons()

}

})



document.addEventListener("click",function(e){

if(e.target.classList.contains("teilnehmer-link")){

const kurs = e.target.dataset.kurs

const kursName = e.target.dataset.name

const liste = getTeilnehmer(kurs)

const ul = document.getElementById("teilnehmerListe")

const titel = document.getElementById("modalKursTitel")

titel.innerText = "Teilnehmerliste – " + kursName

ul.innerHTML=""

liste.forEach(name=>{

const li=document.createElement("li")

li.className="list-group-item"

li.innerText=name

ul.appendChild(li)

})

const frei = maxTeilnehmer - liste.length

for(let i=0;i<frei;i++){

const li=document.createElement("li")

li.className="list-group-item text-muted"

li.innerText="Platz frei"

ul.appendChild(li)

}

}

})


updateCounts()

updateUserButtons()
