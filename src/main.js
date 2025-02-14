import './style.css'
import { Client } from 'appwrite';

const client = new Client();
client.setProject('67afce4b001c520df15a');

const databases = new Databases(client)

const promise = databases.createDocument()