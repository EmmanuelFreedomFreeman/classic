// Import the functions you need from the SDKs you need

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getStorage, ref, uploadBytes,getDownloadURL  } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js";
import { getFirestore,doc, setDoc,addDoc,collection,getDocs,query, where,onSnapshot } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js'
// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCNy_GrF6SU3bOAEgXOqrPAAgvZAYDgXJk",
    authDomain: "classic-fee4e.firebaseapp.com",
    projectId: "classic-fee4e",
    storageBucket: "classic-fee4e.appspot.com",
    messagingSenderId: "776590072014",
    appId: "1:776590072014:web:c88711724d4cd2b0fc589f"
};


// Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const storage = getStorage();


// add document 
$('.upload').click( async ()=>{
    
    let datee = $('#mois').val()+'/'+$('#annee').val()
    $('#namefolder').val(datee)
    if ($('#namefolder').val() == '' || $('#namefolder').val() == null || $('#namefolder').val().trim() === '') {
        alert('the field is empty')
    }else{
        
    //check if doc exist
    let getit = null
    const q = query(collection(db, "classic"), where("name", "==", $('#namefolder').val()));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
    
        getit = {id_doc_file : doc.id,...doc.data()}

    });
    if(getit){
       alert('the folder does exist')
        
    }else{
        const docRef = await addDoc(collection(db, "classic"),{id:Date.now(),name:$('#namefolder').val()});
        $('#namefolder').val(null) 
    }
       
    }
    
    
})

// get all docs

let arr = new Array()
    
const unsub = onSnapshot(collection(db, "classic"), (snapshot) => {
    
    snapshot.docChanges().forEach((change) => {
            let getit = null
            getit = {id_doc : change.doc.id,...change.doc.data()}
            arr.push(getit)
        });

        if(arr){
            $('.file').html('')
            arr.forEach(element => {
                
                $('.file').append(`
                    <div id="folder${element?.id_doc}" style="background-color: #eee;margin-left: 10px;">
                        <img src="./imgs/folder.webp" style="width: 200px;cursor: pointer;" />
                        <p style="text-align: center;">${element?.name}</p>
                    </div>
                `)
                $(`#folder${element?.id_doc}`).click(()=>{
                    window.open(`http://app.classiccoachtransport.com/grid/uploadfile.php?id_doc=${element?.id_doc}&name=${element?.name}`,"", "width=1500, height=550");
                })
            });
            
        }else{
            alert('data doesnt exist')
        }
        
});


// on load get it 

$('.upload2').click(async()=>{
    
    let arrr = new Array()

    const q = collection(db, "classic");
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
    
        let getit = null
        getit = {id_doc : doc.id,...doc.data()}
        arrr.push(getit)

    });

    if(arrr){
        $('.file').html('')
        arr.forEach(element => {
            
            $('.file').append(`
                <div id="folder${element?.id_doc}" style="background-color: #eee;margin-left: 10px;">
                    <img src="./imgs/folder.webp" style="width: 200px;cursor: pointer;" />
                    <p style="text-align: center;">${element?.name}</p>
                </div>
            `)
            $(`#folder${element?.id_doc}`).click(()=>{
                window.open(`http://app.classiccoachtransport.com/grid/uploadfile.php?id_doc=${element?.id_doc}&name=${element?.name}`,"", "width=1500, height=550");
            })
            
        });
        
    }else{
        alert('data doesnt exist')
    }
})



    


