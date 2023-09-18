import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc, query, where } from "firebase/firestore/lite"

const firebaseConfig = {
  apiKey: "AIzaSyDZGIuQg5NynEUPhsHmqNC4GLHaCUvct2I",
  authDomain: "vanlife-ab1f3.firebaseapp.com",
  projectId: "vanlife-ab1f3",
  storageBucket: "vanlife-ab1f3.appspot.com",
  messagingSenderId: "1079706303649",
  appId: "1:1079706303649:web:036d36af13742083d644e0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

// Refactoring the fetching functions below
const vansCollectionRef = collection(db, "vans")

// old
// export async function getVans(id) {
//     const url = id ? `/api/vans/${id}` : "/api/vans"
//     const res = await fetch(url)
//     if (!res.ok) {
//         throw {
//             message: "Failed to fetch vans",
//             statusText: res.statusText,
//             status: res.status
//         }
//     }
//     const data = await res.json()
//     return data.vans
// }

// new FB
// The way the firestore works we will end up needing a get vans (plural) and get van (singular) separately 
export async function getVans() {
    // We need to get a snapshot of the current documents in the vans collection
    const snapshot = await getDocs(vansCollectionRef)
    // From that snapshot, we need to map through a change the data returned for the component slightly
    const vans = snapshot.docs.map(doc => ({
        // return the data, spread
        ...doc.data(),
        // change how the id is returned, as the component will be expecting it 
        id: doc.id
    }))
    console.log(vans)
    return vans
}

export async function getVan(id) {
    // Set the reference to the db, collectoin, and docuemnt by id
    const docRef = doc(db, "vans", id)
    // actually grab the document, save as snapshot
    const snapshot = await getDoc(docRef)
    // Like before, make sure we return the data how the compoennt is expecting it
    return {
        ...snapshot.data(),
        id: snapshot.id
    }
}


//old
// export async function getHostVans(id) {
//     const url = id ? `/api/host/vans/${id}` : "/api/host/vans"
//     const res = await fetch(url)
//     if (!res.ok) {
//         throw {
//             message: "Failed to fetch vans",
//             statusText: res.statusText,
//             status: res.status
//         }
//     }
//     const data = await res.json()
//     return data.vans
// }

//new
export async function getHostVans() {
    // create a query which will take our collection and select a part
    // we will select where the hostID == 123
    const q = query(vansCollectionRef, where("hostId", "==", "123"))
    // Tell getDocs to use q, and vansCollectionRef
    const snapshot = await getDocs(q)
    const vans = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
    }))
    return vans
}

export async function loginUser(creds) {
    const res = await fetch("/api/login",
        { method: "post", body: JSON.stringify(creds) }
    )
    const data = await res.json()

    if (!res.ok) {
        throw {
            message: data.message,
            statusText: res.statusText,
            status: res.status
        }
    }

    return data
}