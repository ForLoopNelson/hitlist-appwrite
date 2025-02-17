import './style.css'

import { Client, Databases, ID } from 'appwrite';
import { PROJECT_ID, DATABASE_ID, COLLECTION_ID } from './shhh.js';


const client = new Client();
client.setProject(PROJECT_ID);


const databases = new Databases(client)

const form = document.querySelector('form')



form.addEventListener('submit', addJob)

function addJob(e){
  e.preventDefault()
  const rawDate = e.target.dateAdded.value
 

  const job = databases.createDocument(
    DATABASE_ID,
    COLLECTION_ID,
    ID.unique(),
    { "company-name": e.target.companyName.value,
      "date-added": rawDate,
      "role":  e.target.role.value,
      "location":  e.target.location.value,
      "position-type":  e.target.positionType.value,
      "source":  e.target.source.value
     }
  );
  job.then(function (response) {
    console.log(job)
      addJobsToDom()
  }, function (error) {
      console.log(error);
  });
  form.reset()
}

async function addJobsToDom(){
    document.querySelector('ul').innerHTML = ""
    let response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID
  );

  response.documents.forEach((job)=>{
    let formattedDate = job['date-added']; 
    if (formattedDate) {
        formattedDate = new Date(formattedDate).toDateString(); // Convert ISO format
    }
    const li = document.createElement('li') 

    li.innerHTML = `<span id="company-name">${job['company-name']}</span> <br> <span id="date-added"> ${formattedDate} </span> <br>  <span id="role">${job['role']}</span> <br> <span id="location">${job['location']} </span> <br> <span id="position-type"> ${job['position-type']} </span> <br> <a href id="url"> ${job['source']} </a> <br>  coffee chat?  <br>${job['chat']} <br> `
    
    li.classList.add('job-details')
    li.id = job.$id
  
    
    const deleteBtn = document.createElement('button')
    deleteBtn.textContent = '💥'
    deleteBtn.onclick = () => removeJob(job.$id)

    const coffeeBtn = document.createElement('button')
    coffeeBtn.textContent = '☕'
    coffeeBtn.onclick = () => updateChat(job.$id)
    
    const addNotesBtn = document.createElement('button')
    addNotesBtn.textContent = 'Add/View Notes'
    addNotesBtn.onclick = () => toggleText(job.$id)

    

    li.appendChild(coffeeBtn)
    li.appendChild(deleteBtn)
    li.appendChild(addNotesBtn)

    document.querySelector('ul').appendChild(li)

    deleteBtn.classList.add('delete-btn');
    coffeeBtn.classList.add('coffee-btn');
    addNotesBtn.classList.add('notes-btn');

  })

  async function removeJob(id){
    const result = await databases.deleteDocument(
      DATABASE_ID, // databaseId
      COLLECTION_ID, // collectionId
      id // documentId
    );
    document.getElementById(id).remove()
  
  }
  async function updateChat(id){
    const result = databases.updateDocument(
      DATABASE_ID, // databaseId
      COLLECTION_ID, // collectionId
      id, // documentId
      {'chat': true} // data (optional)
        // permissions (optional)
    );
    result.then(function(){location.reload()})
  }


}
addJobsToDom()
