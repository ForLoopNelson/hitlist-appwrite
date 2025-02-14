import './style.css'
import { Client } from 'appwrite';

const client = new Client();
client.setProject('67afce4b001c520df15a');

const databases = new Databases(client)

const form = document.querySelector('form')

form.addEventListener('submit', addJob)

function addJob(e) {
  e.preventDefault()
}

const promise = databases.createDocument()