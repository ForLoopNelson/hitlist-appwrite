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
  const rawDate = e.target.dateAdded.value; 
  const [year, month, day] = rawDate.split('-'); 
  const formattedDate = `${month}/${day}/${year.slice(-2)}`;

  console.log(formattedDate, typeof(formattedDate))
  const job = databases.createDocument(
    DATABASE_ID,
    COLLECTION_ID,
    ID.unique(),
    { "company-name": e.target.companyName.value,
      "date-added": formattedDate,
      "role":  e.target.role.value,
      "location":  e.target.location.value,
      "position-type":  e.target.positionType.value,
      "source":  e.target.source.value
     }
  );
  job.then(function (response) {
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
    const li = document.createElement('li')
    li.textContent = `${job['company-name']}  |  ${job['date-added']}  | ${job['role']} | ${job['location']} | ${job['position-type']} | ${job['source']} |   coffee chat? ${job['chat']} `

    li.id = job.$id

    const deleteBtn = document.createElement('button')
    deleteBtn.textContent = '♻'
    deleteBtn.onclick = () => removeJob(job.$id)

    const coffeeBtn = document.createElement('button')
    coffeeBtn.textContent = '☕'
    coffeeBtn.onclick = () => updateChat(job.$id)

    li.appendChild(coffeeBtn)
    li.appendChild(deleteBtn)

    document.querySelector('ul').appendChild(li)
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
