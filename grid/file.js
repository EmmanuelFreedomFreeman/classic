// Import the functions you need from the SDKs you need

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getStorage, ref, uploadBytes,getDownloadURL  } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js";
import { getFirestore,doc,getDoc, setDoc,addDoc,collection,getDocs,query, where,onSnapshot } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js'

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

let arr = new Array()
$('#loading').hide()
// update document 
$('.upload1').click( async ()=>{
    if ($('#namefolder1').val() == '' || $('#namefolder1').val() == null || $('#namefolder1').val().trim() === '') {
        alert('the field is empty')
    }else{
        $('#loading').show()
        
        const docReff = doc(db, "classic", $('#id_doc').val());
        const docSnap = await getDoc(docReff);

        if (docSnap.exists()) {
        let data = docSnap.data()
        data.name = $('#namefolder1').val()
        data.type = $('#type').val()
        
        await setDoc(doc(db, "classic", $('#id_doc').val()), data);
        $('#loading').hide()
        alert("data updated")
        } else {
        // doc.data() will be undefined in this case
        //console.log("No such document!");
        }
    }
    
    
})


// send file data

$('#file-import-json').change(function(e){
    
    var reader = new FileReader();
    var file = e.target.files[0];

    reader.readAsBinaryString(file);

    reader.onload = async  function(e){
        var data = e.target.result;
        var workbook = XLSX.read(data, {
            type: 'binary', cellDates: true, cellText:false
        });

        var firstSheetName = workbook.SheetNames[0];
        var XLRowObject = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName], {raw: false, dateNF: "YYYY-MM-DD"});
        var jsonObject = JSON.stringify(XLRowObject);
        
        // insert file data
        $('#loading').show()
        $('#gridfile').hide()
        $('#dd').hide()
        const docReff = doc(db, "classic", $('#id_doc').val());
        const docSnap = await getDoc(docReff);

        if (docSnap.exists()) {
            let data = docSnap.data()
            data = {id:Date.now(),id_doc:$('#id_doc').val(),type:$('#type').val(),name_doc:$('#name').val(),namefile: $('#filename').val(),file: XLRowObject}
            
            if ($('#upp').val() !='' && $('#upp').val() != null && $('#upp').val().trim() != '' && $('#filename').val() != '' && $('#filename').val() != null && $('#filename').val().trim() != '') {
                await setDoc(doc(db, "files", $('#upp').val()), data);
                $('#filename').val('')
                $('#upp').val('')
                alert("the file has been updated")
            }else{
                await addDoc(collection(db, "files"),data);
                alert("file inserted")
            }
            
            $('#loading').hide()
            $('#gridfile').show()
            $('#dd').show()
            $('#filename').val('')
            
        }
        //console.log(XLRowObject)
    };

    reader.onerror = function(e){
        alert('Error: ' + e.target.error.code);
    }

});


// display all the liste of files on the grid
let document = new Array()
const q = query(collection(db, "files"), where("id_doc", "==", $('#id_doc').val()));
const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
// doc.data() is never undefined for query doc snapshots
//$('#ex').html(JSON.stringify(doc.data()))

document.push(doc.data())
$('#filllist').append(`
<div id='eer${doc.id}' style='background-color:white;display:flex;padding:10px;margin-top:15px;'>
    <img src="../imgs/file.png" style="width: 30px;height: 30px;margin-right:20px;" /> 
    <h5 style=''>${doc.data().namefile}</h5>
    <p id='eervv${doc.id}' style='cursor:pointer;background-color:#eee;margin:5px;padding: 1em;'>SELECT FILE TO UPDATE</p>
    <p id='eervvxx${doc.id}' style='cursor:pointer;background-color:#eee;margin:5px;padding: 1em;'>DISPLAY FILE</p>
</div>
`)

$(`#eervv${doc.id}`).click(()=>{
    $('#gridfile').show('')
    $('#rere').hide('')
    $('#filename').val(doc.data().namefile)
    $('#type').val(doc.data().type)
    $('#upp').val(doc.id)
    
})

$(`#eervvxx${doc.id}`).click(()=>{
    $('#gridfile').hide('')
    $('#rere').show('')
    $('#filename').val('')
    $('#type').val('')
    $('#upp').val('')
    $("#gridfile").hide('')
    $("#rere").html(`
    <div style='text-align:center'>
        <p>Id. Nat: 6-93-N 63118 H   RCCM : 14-A-0874</p>
        <p style='margin-top:-15px;'>503, Av. MOERO & 1567, Av. KASAVUBU / Commune de Lubumbashi</p>
        <p style='margin-top:-15px;border: 1px solid black;padding:5px;'>${doc.data().namefile}</p>
    </div>

    <table class="table table-bordered">
        <thead>
            <tr id='kee'>
            <th scope="col">N*</th>
                <th scope="col">ACCOUNT CODE</th>
                <th scope="col">DESCRIPTION</th>
                <th scope="col">EXPENSE</th>
                <th scope="col">INCOME</th>
            </tr>
        </thead>
        <tbody id='lll'>
            
        </tbody>
    </table>
    `)

    
// display data for non global 

let datafile = [{"ACCOUNT CODE":"60430000","DESCRIPTION":"CLEANING PRODUCT","EXPENSE":"19450800"},{"ACCOUNT CODE":"60440000","DESCRIPTION":"SPARE PARTS","EXPENSE":"1559104225"},{"ACCOUNT CODE":"60470000","DESCRIPTION":"OFFICE FORNITURES ","EXPENSE":"56354975"},{"ACCOUNT CODE":"60510000","DESCRIPTION":"REGIDESO (NATIONAL WATER INST.)","EXPENSE":"6052840"},{"ACCOUNT CODE":"60520000","DESCRIPTION":"SNEL (NATIONAL ELECTRICITY INST.)","EXPENSE":"15693420"},{"ACCOUNT CODE":"60530000","DESCRIPTION":"DIESEL","EXPENSE":"5881451155"},{"ACCOUNT CODE":"60531000","DESCRIPTION":"PETROL","EXPENSE":"149211569.1"},{"ACCOUNT CODE":"61000000","DESCRIPTION":"TRANSPORT","EXPENSE":"43081785"},{"ACCOUNT CODE":"62100000","DESCRIPTION":"RENT","EXPENSE":"570457300"},{"ACCOUNT CODE":"62180000","DESCRIPTION":"PASSENGER GUEST","EXPENSE":"2147000"},{"ACCOUNT CODE":"62190000","DESCRIPTION":"STAFF GUEST","EXPENSE":"8380500"},{"ACCOUNT CODE":"62400000","DESCRIPTION":"SERVICE AND REPARATION","EXPENSE":"77324749"},{"ACCOUNT CODE":"62700000","DESCRIPTION":"ADVERTISING","EXPENSE":"2130000"},{"ACCOUNT CODE":"62800000","DESCRIPTION":"COMMUNICATION","EXPENSE":"30384560"},{"ACCOUNT CODE":"62900000","DESCRIPTION":"OTHER EXTERNAL CHARGES","EXPENSE":"24914050"},{"ACCOUNT CODE":"63300000","DESCRIPTION":"STAFF STRANING FEES","EXPENSE":"2663200"},{"ACCOUNT CODE":"63841000","DESCRIPTION":"POSHO BUS","EXPENSE":"698936950"},{"ACCOUNT CODE":"63843000","DESCRIPTION":"STAFF TRIP FEES","EXPENSE":"662500"},{"ACCOUNT CODE":"64100000","DESCRIPTION":"DGM","EXPENSE":"26985600"},{"ACCOUNT CODE":"64110000","DESCRIPTION":"DGRAD","EXPENSE":"32398000"},{"ACCOUNT CODE":"64120000","DESCRIPTION":"DGI","EXPENSE":"6488000"},{"ACCOUNT CODE":"64130000","DESCRIPTION":"OFIDA","EXPENSE":"140729000"},{"ACCOUNT CODE":"64140000","DESCRIPTION":"PMEA","EXPENSE":"3769000"},{"ACCOUNT CODE":"64150000","DESCRIPTION":"POLICE","EXPENSE":"35840950"},{"ACCOUNT CODE":"64160000","DESCRIPTION":"ANR","EXPENSE":"12011000"},{"ACCOUNT CODE":"64170000","DESCRIPTION":"PCR","EXPENSE":"23776025"},{"ACCOUNT CODE":"64180000","DESCRIPTION":"IMPOTS","EXPENSE":"69015500"},{"ACCOUNT CODE":"64190000","DESCRIPTION":"PEAGE (RAODS TOLL)","EXPENSE":"352374520"},{"ACCOUNT CODE":"64200000","DESCRIPTION":"MAIRIE/PARKING","EXPENSE":"164961550"},{"ACCOUNT CODE":"64210000","DESCRIPTION":"INSSURANCE","EXPENSE":"101698805"},{"ACCOUNT CODE":"64220000","DESCRIPTION":"TOURISME","EXPENSE":"1209500"},{"ACCOUNT CODE":"64300000","DESCRIPTION":"VIGNETTES","EXPENSE":"95291455"},{"ACCOUNT CODE":"64340000","DESCRIPTION":"ENVIRONMENTAL INSTITUTION","EXPENSE":"6714860"},{"ACCOUNT CODE":"64350000","DESCRIPTION":"NATIONAL LABOR INSPECTION","EXPENSE":"1840000"},{"ACCOUNT CODE":"64700000","DESCRIPTION":"PENALITIES","EXPENSE":"13193100"},{"ACCOUNT CODE":"64800000","DESCRIPTION":"OTHER TAXES","EXPENSE":"495513635"},{"ACCOUNT CODE":"65100000","DESCRIPTION":"KUVUTA GARI","EXPENSE":"2691000"},{"ACCOUNT CODE":"65110000","DESCRIPTION":"GARAMA ZA NJIANI","EXPENSE":"4563000"},{"ACCOUNT CODE":"65120000","DESCRIPTION":"MATUNZO ABIRA","EXPENSE":"68450225"},{"ACCOUNT CODE":"65200000","DESCRIPTION":"CAR WASH","EXPENSE":"42263200"},{"ACCOUNT CODE":"65600000","DESCRIPTION":"KULIPA MZIGO","EXPENSE":"98281645"},{"ACCOUNT CODE":"65800000","DESCRIPTION":"VISA FEES","EXPENSE":"52031795"},{"ACCOUNT CODE":"65900000","DESCRIPTION":"MATUMIZI OFFICE","EXPENSE":"1239049178"},{"ACCOUNT CODE":"65910000","DESCRIPTION":"UJENZI","EXPENSE":"2893321991"},{"ACCOUNT CODE":"66000000","DESCRIPTION":"SALARY","EXPENSE":"2337774206"},{"ACCOUNT CODE":"66100000","DESCRIPTION":"POSHO OFFICY","EXPENSE":"1557438285"},{"ACCOUNT CODE":"66220000","DESCRIPTION":"GRATIFICATION/PRIMES","EXPENSE":"704800"},{"ACCOUNT CODE":"66230000","DESCRIPTION":"DECOMPTE FINAL","EXPENSE":"30301558.26"},{"ACCOUNT CODE":"66831000","DESCRIPTION":"INSS","EXPENSE":"44607044"},{"ACCOUNT CODE":"66832000","DESCRIPTION":"SERVICE EMPLOI","EXPENSE":"3260000"},{"ACCOUNT CODE":"66840000","DESCRIPTION":"MATUNZO/SOINS","EXPENSE":"181469420"},{"ACCOUNT CODE":"TOTAL_EXPENSE","EXPENSE":"19288419425"},{"ACCOUNT CODE":"ACCOUNT CODE","DESCRIPTION":"DESCRIPTION","EXPENSE":"EXPENSE","INCOME":"INCOME"},{"ACCOUNT CODE":"70600000","DESCRIPTION":"TICKETS SOLD","INCOME":"1649659000"},{"ACCOUNT CODE":"70610000","DESCRIPTION":"CARGO","INCOME":"360427044.8"},{"ACCOUNT CODE":"70620000","DESCRIPTION":"ROAD COLLECTION","INCOME":"926000"},{"ACCOUNT CODE":"TOTALE","INCOME":"2011012045"},{"ACCOUNT CODE":"ACCOUNT CODE","DESCRIPTION":"DESCRIPTION","EXPENSE":"EXPENSE","INCOME":"INCOME"},{"ACCOUNT CODE":"1","DESCRIPTION":"TOTAL BALANCE","INCOME":"-17277407380"},{"ACCOUNT CODE":"2","DESCRIPTION":"GLOBAL BALANCE CDF","INCOME":"-17277407380"},{"ACCOUNT CODE":"3","DESCRIPTION":"GLOBAL BALANCE USD","INCOME":"-8469317.343"},{"ACCOUNT CODE":"NUM","DESCRIPTION":"DESCRIPTION_DAR","EXPENSE":"DESCRIPTION_DAR2","INCOME":"AMOUNT_DAR"},{"ACCOUNT CODE":"NUM_1","DESCRIPTION":"GARAMA ZA BANK","EXPENSE":"DEC","INCOME":"12"},{"ACCOUNT CODE":"NUM_2","DESCRIPTION":"ZANZIBAR","EXPENSE":"2022-12-12","INCOME":"25"},{"ACCOUNT CODE":"NUM_3"},{"ACCOUNT CODE":"NUM_4"},{"ACCOUNT CODE":"TOTAL_DAR","INCOME":"37"},{"ACCOUNT CODE":"ACCOUNT CODE","DESCRIPTION":"DESCRIPTION_RESUME","EXPENSE":"Column3","INCOME":"AMOUNT_RESUME"},{"ACCOUNT CODE":"RESUME_1","DESCRIPTION":"PROFIT/ LOSS DEC 2022","INCOME":"-8469317.343"},{"ACCOUNT CODE":"RESUME_2","DESCRIPTION":"DEC 2022 BALANCE / LUBUMBASHI","INCOME":"-8469354.343"},{"ACCOUNT CODE":"RESUME_3","DESCRIPTION":"DEC 2022 BALANCE KINSHSA","INCOME":"119480"},{"ACCOUNT CODE":"RESUME_4","DESCRIPTION":"NOV 2022 LUBUMBASHI AND KINSHASA","INCOME":"33548.48"},{"ACCOUNT CODE":"RESUME_5","DESCRIPTION":"DEC 2022 LUBUMBASHI AND KINSHASA","INCOME":"-8316325.863"}]
let vv = 1
let tot_expense = 0
let tot_income = 0
let tot_expense_ticket = 0
let tot_income_ticket = 0
let tot_expense_dar = 0
let tot_income_dar = 0
let kin_lubum = 0

datafile.forEach(el => {
    $('#lll').append(`
            <tr id='val${el["ACCOUNT CODE"]}' >
                <td >${vv++}</td>
                <th scope="row" style='width:20px;'>${el["ACCOUNT CODE"]}</th>
                <td >${el["DESCRIPTION"]?el["DESCRIPTION"]:''}</td>               
            </tr>
              
        `)
        
        let ii = 0
        let iii = 0
        let begin_totale = 0
        doc.data().file.forEach((element,k )=> {
            let key = k
            if (el["ACCOUNT CODE"] == element["ACCOUNT CODE"]) {
                if (el["ACCOUNT CODE"] == 'TOTAL_EXPENSE') {
                    ii = 1
                }
                
                if (el["ACCOUNT CODE"] == 'TOTALE') {
                    iii = 1
                }
                if (k>=53 && k<=55) {
                    tot_expense_ticket = parseFloat(tot_expense_ticket) + parseFloat(element['EXPENSE']?element['EXPENSE']:0)
                    tot_income_ticket = parseFloat(tot_income_ticket) + parseFloat(element['INCOME']?element['INCOME']:0)
                    
                }
                if (vv<= 52) {
                    tot_expense = parseFloat(tot_expense) + parseFloat(element['EXPENSE']?element['EXPENSE']:0)
                    tot_income = tot_income + parseFloat(element['INCOME']?element['INCOME']:0)
                    
                }

                if (k>=62 && k <=65) {
                    tot_expense_dar = parseFloat(tot_expense_dar) + parseFloat(element['EXPENSE']?element['EXPENSE']:0)
                    tot_income_dar = parseFloat(tot_income_dar) + parseFloat(element['INCOME']?element['INCOME']:0)
                    
                }

                if (el["DESCRIPTION"] == 'DEC 2022 BALANCE KINSHSA' || el["DESCRIPTION"] == 'NOV 2022 LUBUMBASHI AND KINSHASA' ) {
                    kin_lubum = parseFloat(kin_lubum) + parseFloat(element['INCOME']?element['INCOME']:0)
                }

               

                if (el["ACCOUNT CODE"] != 'TOTAL_EXPENSE' && el["ACCOUNT CODE"] != 'TOTALE' && el["DESCRIPTION"] != 'TOTAL BALANCE' &&el["DESCRIPTION"] != 'GLOBAL BALANCE CDF' && el["DESCRIPTION"] != 'GLOBAL BALANCE USD' && el["ACCOUNT CODE"] != 'TOTAL_DAR'  && el["DESCRIPTION"] != 'PROFIT/ LOSS DEC 2022'   && el["DESCRIPTION"] != 'DEC 2022 BALANCE / LUBUMBASHI'   && el["DESCRIPTION"] != 'DEC 2022 LUBUMBASHI AND KINSHASA'  ) {
                    $(`#val${el["ACCOUNT CODE"]}`).append(`
                        <td id='expense${key}' onclick='emma("${key}")' >${parseFloat(element['EXPENSE']?element['EXPENSE']:0.00).toFixed(2)}</td>
                        <td id='income${key}' onclick='emma("${key}")' >${parseFloat(element['INCOME']?element['INCOME']:0.00).toFixed(2)}</td>
                    `)

                    $("#expense"+key).click(()=>{
                        PromptMessageSelf(`expense${key}`,element["EXPENSE"]?element["EXPENSE"]:0,'EXPENSE',doc.data().namefile,key)
                             
                    })
                    $("#income"+key).click(()=>{
                        console.log( $("#uppy").val())
                        PromptMessageSelf(`income${key}`,element["INCOME"]?element["INCOME"]:0,'INCOME',doc.data().namefile,key)
                             
                    })
                }

            }
            
        });
        if (el["ACCOUNT CODE"] == 'TOTAL_EXPENSE') {
                
            $(`#val${el["ACCOUNT CODE"]}`).append(`
                    <td style='font-weight: bold;' >${parseFloat(tot_expense).toFixed(2)}</td>
                    <td style='font-weight: bold;' >${parseFloat(tot_income).toFixed(2)}</td>
            `)
        }
        if (el["ACCOUNT CODE"] == 'TOTALE') {
                
            $(`#val${el["ACCOUNT CODE"]}`).append(`
                    <td style='font-weight: bold;'>${parseFloat(tot_expense_ticket).toFixed(2)}</td>
                    <td style='font-weight: bold;'>${parseFloat(tot_income_ticket).toFixed(2)}</td>
            `)
        }
        if (el["DESCRIPTION"] == 'TOTAL BALANCE') {
                
            $(`#val${el["ACCOUNT CODE"]}`).append(`
                    <td style='font-weight: bold;'>0.00</td>
                    <td style='font-weight: bold;'>${parseFloat(tot_income_ticket-tot_expense).toFixed(2)}</td>
            `)
            
        }
        if (el["DESCRIPTION"] == 'GLOBAL BALANCE CDF') {
                
            $(`#val${el["ACCOUNT CODE"]}`).append(`
                    <td style='font-weight: bold;'>0.00</td>
                    <td style='font-weight: bold;'>${parseFloat(tot_income_ticket-tot_expense).toFixed(2)}</td>
            `)
            
        }
        if (el["DESCRIPTION"] == 'GLOBAL BALANCE USD') {
                
            $(`#val${el["ACCOUNT CODE"]}`).append(`
                    <td style='font-weight: bold;' >0.00</td>
                    <td style='font-weight: bold;'>${parseFloat((tot_income_ticket-tot_expense)/2040).toFixed(2)}</td>
            `)
            
        }
        if (el["ACCOUNT CODE"] == 'TOTAL_DAR') {
                
            $(`#val${el["ACCOUNT CODE"]}`).append(`
                    <td style='font-weight: bold;'>${parseFloat(tot_expense_dar).toFixed(2)}</td>
                    <td style='font-weight: bold;' >${parseFloat(tot_income_dar).toFixed(2)}</td>
            `)
        }
        if (el["DESCRIPTION"] == 'PROFIT/ LOSS DEC 2022') {
                
            $(`#val${el["ACCOUNT CODE"]}`).append(`
                    <td style='font-weight: bold;' >0.00</td>
                    <td style='font-weight: bold;'>${parseFloat((tot_income_ticket-tot_expense)/2040).toFixed(2)}</td>
            `)
            
        }
        if (el["DESCRIPTION"] == 'DEC 2022 BALANCE / LUBUMBASHI') {
                
            $(`#val${el["ACCOUNT CODE"]}`).append(`
                    <td style='font-weight: bold;' >0.00</td>
                    <td style='font-weight: bold;'>${parseFloat(((tot_income_ticket-tot_expense)/2040)-tot_income_dar).toFixed(2)}</td>
            `)
            
        }
        if (el["DESCRIPTION"] == 'DEC 2022 LUBUMBASHI AND KINSHASA') {
                
            $(`#val${el["ACCOUNT CODE"]}`).append(`
                    <td style='font-weight: bold;' >0.00</td>
                    <td style='font-weight: bold;'>${parseFloat((((tot_income_ticket-tot_expense)/2040)-tot_income_dar) + kin_lubum).toFixed(2)}</td>
            `)
            
        }
        


});


})


});

let data_to_compare = [{"ACCOUNT CODE":"60430000","DESCRIPTION":"CLEANING PRODUCT","EXPENSE":"19450800"},{"ACCOUNT CODE":"60440000","DESCRIPTION":"SPARE PARTS","EXPENSE":"1559104225"},{"ACCOUNT CODE":"60470000","DESCRIPTION":"OFFICE FORNITURES ","EXPENSE":"56354975"},{"ACCOUNT CODE":"60510000","DESCRIPTION":"REGIDESO (NATIONAL WATER INST.)","EXPENSE":"6052840"},{"ACCOUNT CODE":"60520000","DESCRIPTION":"SNEL (NATIONAL ELECTRICITY INST.)","EXPENSE":"15693420"},{"ACCOUNT CODE":"60530000","DESCRIPTION":"DIESEL","EXPENSE":"5881451155"},{"ACCOUNT CODE":"60531000","DESCRIPTION":"PETROL","EXPENSE":"149211569.1"},{"ACCOUNT CODE":"61000000","DESCRIPTION":"TRANSPORT","EXPENSE":"43081785"},{"ACCOUNT CODE":"62100000","DESCRIPTION":"RENT","EXPENSE":"570457300"},{"ACCOUNT CODE":"62180000","DESCRIPTION":"PASSENGER GUEST","EXPENSE":"2147000"},{"ACCOUNT CODE":"62190000","DESCRIPTION":"STAFF GUEST","EXPENSE":"8380500"},{"ACCOUNT CODE":"62400000","DESCRIPTION":"SERVICE AND REPARATION","EXPENSE":"77324749"},{"ACCOUNT CODE":"62700000","DESCRIPTION":"ADVERTISING","EXPENSE":"2130000"},{"ACCOUNT CODE":"62800000","DESCRIPTION":"COMMUNICATION","EXPENSE":"30384560"},{"ACCOUNT CODE":"62900000","DESCRIPTION":"OTHER EXTERNAL CHARGES","EXPENSE":"24914050"},{"ACCOUNT CODE":"63300000","DESCRIPTION":"STAFF STRANING FEES","EXPENSE":"2663200"},{"ACCOUNT CODE":"63841000","DESCRIPTION":"POSHO BUS","EXPENSE":"698936950"},{"ACCOUNT CODE":"63843000","DESCRIPTION":"STAFF TRIP FEES","EXPENSE":"662500"},{"ACCOUNT CODE":"64100000","DESCRIPTION":"DGM","EXPENSE":"26985600"},{"ACCOUNT CODE":"64110000","DESCRIPTION":"DGRAD","EXPENSE":"32398000"},{"ACCOUNT CODE":"64120000","DESCRIPTION":"DGI","EXPENSE":"6488000"},{"ACCOUNT CODE":"64130000","DESCRIPTION":"OFIDA","EXPENSE":"140729000"},{"ACCOUNT CODE":"64140000","DESCRIPTION":"PMEA","EXPENSE":"3769000"},{"ACCOUNT CODE":"64150000","DESCRIPTION":"POLICE","EXPENSE":"35840950"},{"ACCOUNT CODE":"64160000","DESCRIPTION":"ANR","EXPENSE":"12011000"},{"ACCOUNT CODE":"64170000","DESCRIPTION":"PCR","EXPENSE":"23776025"},{"ACCOUNT CODE":"64180000","DESCRIPTION":"IMPOTS","EXPENSE":"69015500"},{"ACCOUNT CODE":"64190000","DESCRIPTION":"PEAGE (RAODS TOLL)","EXPENSE":"352374520"},{"ACCOUNT CODE":"64200000","DESCRIPTION":"MAIRIE/PARKING","EXPENSE":"164961550"},{"ACCOUNT CODE":"64210000","DESCRIPTION":"INSSURANCE","EXPENSE":"101698805"},{"ACCOUNT CODE":"64220000","DESCRIPTION":"TOURISME","EXPENSE":"1209500"},{"ACCOUNT CODE":"64300000","DESCRIPTION":"VIGNETTES","EXPENSE":"95291455"},{"ACCOUNT CODE":"64340000","DESCRIPTION":"ENVIRONMENTAL INSTITUTION","EXPENSE":"6714860"},{"ACCOUNT CODE":"64350000","DESCRIPTION":"NATIONAL LABOR INSPECTION","EXPENSE":"1840000"},{"ACCOUNT CODE":"64700000","DESCRIPTION":"PENALITIES","EXPENSE":"13193100"},{"ACCOUNT CODE":"64800000","DESCRIPTION":"OTHER TAXES","EXPENSE":"495513635"},{"ACCOUNT CODE":"65100000","DESCRIPTION":"KUVUTA GARI","EXPENSE":"2691000"},{"ACCOUNT CODE":"65110000","DESCRIPTION":"GARAMA ZA NJIANI","EXPENSE":"4563000"},{"ACCOUNT CODE":"65120000","DESCRIPTION":"MATUNZO ABIRA","EXPENSE":"68450225"},{"ACCOUNT CODE":"65200000","DESCRIPTION":"CAR WASH","EXPENSE":"42263200"},{"ACCOUNT CODE":"65600000","DESCRIPTION":"KULIPA MZIGO","EXPENSE":"98281645"},{"ACCOUNT CODE":"65800000","DESCRIPTION":"VISA FEES","EXPENSE":"52031795"},{"ACCOUNT CODE":"65900000","DESCRIPTION":"MATUMIZI OFFICE","EXPENSE":"1239049178"},{"ACCOUNT CODE":"65910000","DESCRIPTION":"UJENZI","EXPENSE":"2893321991"},{"ACCOUNT CODE":"66000000","DESCRIPTION":"SALARY","EXPENSE":"2337774206"},{"ACCOUNT CODE":"66100000","DESCRIPTION":"POSHO OFFICY","EXPENSE":"1557438285"},{"ACCOUNT CODE":"66220000","DESCRIPTION":"GRATIFICATION/PRIMES","EXPENSE":"704800"},{"ACCOUNT CODE":"66230000","DESCRIPTION":"DECOMPTE FINAL","EXPENSE":"30301558.26"},{"ACCOUNT CODE":"66831000","DESCRIPTION":"INSS","EXPENSE":"44607044"},{"ACCOUNT CODE":"66832000","DESCRIPTION":"SERVICE EMPLOI","EXPENSE":"3260000"},{"ACCOUNT CODE":"66840000","DESCRIPTION":"MATUNZO/SOINS","EXPENSE":"181469420"}]
data_to_compare = [{"ACCOUNT CODE":"60430000","DESCRIPTION":"CLEANING PRODUCT","EXPENSE":"19450800"},{"ACCOUNT CODE":"60440000","DESCRIPTION":"SPARE PARTS","EXPENSE":"1559104225"},{"ACCOUNT CODE":"60470000","DESCRIPTION":"OFFICE FORNITURES ","EXPENSE":"56354975"},{"ACCOUNT CODE":"60510000","DESCRIPTION":"REGIDESO (NATIONAL WATER INST.)","EXPENSE":"6052840"},{"ACCOUNT CODE":"60520000","DESCRIPTION":"SNEL (NATIONAL ELECTRICITY INST.)","EXPENSE":"15693420"},{"ACCOUNT CODE":"60530000","DESCRIPTION":"DIESEL","EXPENSE":"5881451155"},{"ACCOUNT CODE":"60531000","DESCRIPTION":"PETROL","EXPENSE":"149211569.1"},{"ACCOUNT CODE":"61000000","DESCRIPTION":"TRANSPORT","EXPENSE":"43081785"},{"ACCOUNT CODE":"62100000","DESCRIPTION":"RENT","EXPENSE":"570457300"},{"ACCOUNT CODE":"62180000","DESCRIPTION":"PASSENGER GUEST","EXPENSE":"2147000"},{"ACCOUNT CODE":"62190000","DESCRIPTION":"STAFF GUEST","EXPENSE":"8380500"},{"ACCOUNT CODE":"62400000","DESCRIPTION":"SERVICE AND REPARATION","EXPENSE":"77324749"},{"ACCOUNT CODE":"62700000","DESCRIPTION":"ADVERTISING","EXPENSE":"2130000"},{"ACCOUNT CODE":"62800000","DESCRIPTION":"COMMUNICATION","EXPENSE":"30384560"},{"ACCOUNT CODE":"62900000","DESCRIPTION":"OTHER EXTERNAL CHARGES","EXPENSE":"24914050"},{"ACCOUNT CODE":"63300000","DESCRIPTION":"STAFF STRANING FEES","EXPENSE":"2663200"},{"ACCOUNT CODE":"63841000","DESCRIPTION":"POSHO BUS","EXPENSE":"698936950"},{"ACCOUNT CODE":"63843000","DESCRIPTION":"STAFF TRIP FEES","EXPENSE":"662500"},{"ACCOUNT CODE":"64100000","DESCRIPTION":"DGM","EXPENSE":"26985600"},{"ACCOUNT CODE":"64110000","DESCRIPTION":"DGRAD","EXPENSE":"32398000"},{"ACCOUNT CODE":"64120000","DESCRIPTION":"DGI","EXPENSE":"6488000"},{"ACCOUNT CODE":"64130000","DESCRIPTION":"OFIDA","EXPENSE":"140729000"},{"ACCOUNT CODE":"64140000","DESCRIPTION":"PMEA","EXPENSE":"3769000"},{"ACCOUNT CODE":"64150000","DESCRIPTION":"POLICE","EXPENSE":"35840950"},{"ACCOUNT CODE":"64160000","DESCRIPTION":"ANR","EXPENSE":"12011000"},{"ACCOUNT CODE":"64170000","DESCRIPTION":"PCR","EXPENSE":"23776025"},{"ACCOUNT CODE":"64180000","DESCRIPTION":"IMPOTS","EXPENSE":"69015500"},{"ACCOUNT CODE":"64190000","DESCRIPTION":"PEAGE (RAODS TOLL)","EXPENSE":"352374520"},{"ACCOUNT CODE":"64200000","DESCRIPTION":"MAIRIE/PARKING","EXPENSE":"164961550"},{"ACCOUNT CODE":"64210000","DESCRIPTION":"INSSURANCE","EXPENSE":"101698805"},{"ACCOUNT CODE":"64220000","DESCRIPTION":"TOURISME","EXPENSE":"1209500"},{"ACCOUNT CODE":"64300000","DESCRIPTION":"VIGNETTES","EXPENSE":"95291455"},{"ACCOUNT CODE":"64340000","DESCRIPTION":"ENVIRONMENTAL INSTITUTION","EXPENSE":"6714860"},{"ACCOUNT CODE":"64350000","DESCRIPTION":"NATIONAL LABOR INSPECTION","EXPENSE":"1840000"},{"ACCOUNT CODE":"64700000","DESCRIPTION":"PENALITIES","EXPENSE":"13193100"},{"ACCOUNT CODE":"64800000","DESCRIPTION":"OTHER TAXES","EXPENSE":"495513635"},{"ACCOUNT CODE":"65100000","DESCRIPTION":"KUVUTA GARI","EXPENSE":"2691000"},{"ACCOUNT CODE":"65110000","DESCRIPTION":"GARAMA ZA NJIANI","EXPENSE":"4563000"},{"ACCOUNT CODE":"65120000","DESCRIPTION":"MATUNZO ABIRA","EXPENSE":"68450225"},{"ACCOUNT CODE":"65200000","DESCRIPTION":"CAR WASH","EXPENSE":"42263200"},{"ACCOUNT CODE":"65600000","DESCRIPTION":"KULIPA MZIGO","EXPENSE":"98281645"},{"ACCOUNT CODE":"65800000","DESCRIPTION":"VISA FEES","EXPENSE":"52031795"},{"ACCOUNT CODE":"65900000","DESCRIPTION":"MATUMIZI OFFICE","EXPENSE":"1239049178"},{"ACCOUNT CODE":"65910000","DESCRIPTION":"UJENZI","EXPENSE":"2893321991"},{"ACCOUNT CODE":"66000000","DESCRIPTION":"SALARY","EXPENSE":"2337774206"},{"ACCOUNT CODE":"66100000","DESCRIPTION":"POSHO OFFICY","EXPENSE":"1557438285"},{"ACCOUNT CODE":"66220000","DESCRIPTION":"GRATIFICATION/PRIMES","EXPENSE":"704800"},{"ACCOUNT CODE":"66230000","DESCRIPTION":"DECOMPTE FINAL","EXPENSE":"30301558.26"},{"ACCOUNT CODE":"66831000","DESCRIPTION":"INSS","EXPENSE":"44607044"},{"ACCOUNT CODE":"66832000","DESCRIPTION":"SERVICE EMPLOI","EXPENSE":"3260000"},{"ACCOUNT CODE":"66840000","DESCRIPTION":"MATUNZO/SOINS","EXPENSE":"181469420"},{"ACCOUNT CODE":"TOTAL_EXPENSE","EXPENSE":"19288419425"},{"ACCOUNT CODE":"ACCOUNT CODE","DESCRIPTION":"DESCRIPTION","EXPENSE":"EXPENSE","INCOME":"INCOME"},{"ACCOUNT CODE":"70600000","DESCRIPTION":"TICKETS SOLD","INCOME":"306220000"},{"ACCOUNT CODE":"70610000","DESCRIPTION":"CARGO","INCOME":"163589903.7"},{"ACCOUNT CODE":"70620000","DESCRIPTION":"ROAD COLLECTION","INCOME":"926000"},{"ACCOUNT CODE":"TOTALE","INCOME":"470735903.7"},{"ACCOUNT CODE":"ACCOUNT CODE","DESCRIPTION":"DESCRIPTION","EXPENSE":"EXPENSE","INCOME":"INCOME"},{"ACCOUNT CODE":"1","DESCRIPTION":"TOTAL BALANCE","INCOME":"-18817683521"},{"ACCOUNT CODE":"2","DESCRIPTION":"GLOBAL BALANCE CDF","INCOME":"-18817683521"},{"ACCOUNT CODE":"3","DESCRIPTION":"GLOBAL BALANCE USD","INCOME":"-9224354.667"},{"ACCOUNT CODE":"NUM","DESCRIPTION":"NUM","EXPENSE":"DESCRIPTION_DAR","INCOME":"AMOUNT_DAR"},{"ACCOUNT CODE":"NUM_1","DESCRIPTION":"DEC","EXPENSE":"GARAMA ZA BANK","INCOME":"12"},{"ACCOUNT CODE":"TOTAL_DAR","INCOME":"12"}]// show grid calculator 
$('#rose').hide('')
$('.listoffiles').click(()=>{
    $('#rere').hide('')
    $('#filename').val('')
    $('#type').val('')
    $('#upp').val('')
    $("#cx").html(`
    <p>Id. Nat: 6-93-N 63118 H   RCCM : 14-A-0874</p>
    <p style='margin-top:-15px;'>503, Av. MOERO & 1567, Av. KASAVUBU / Commune de Lubumbashi</p>
    <p style='margin-top:-15px;border: 1px solid black;padding:5px;'>VERIFICATION COHERENCE RAPPORT CLASSIC </p>

    <table class="table table-bordered">
        <thead>
            <tr id='ke'>
            <th scope="col">N*</th>
                <th scope="col">ACCOUNT CODE</th>
                <th scope="col">DESCRIPTION</th>
            </tr>
        </thead>
        <tbody id='ll'>
            
        </tbody>
    </table>
    `)
    
    $('#grid').hide('')
    $('#gridfile').hide('')
    $('#dd').hide('')
    $('#rose').show('')
    let global_file = null
    let f = 1
    let v = 0
    let ui = 0
    data_to_compare.forEach(el =>{
        if (f === 58) {
            return 0
        }
        $('#ll').append(`
            <tr id='ff${el["ACCOUNT CODE"]}' >
                <td >${f++}</td>
                <th scope="row" style='width:20px;'>${el["ACCOUNT CODE"]}</th>
                <td >${el["DESCRIPTION"]?el["DESCRIPTION"]:''}</td>               
            </tr>
              
        `)
        let y = 0
        let index = 0
        
        let total_cumul = []
        document.forEach(al =>{
            
            let total_expenses = 0
            let total_income = 0
            let total_extra_expenses = 0
            let total_extra_income = 0
            let total_extra_expenses_dar = 0
            let total_extra_income_dar = 0
            let cumul = []
            if(al.type == 'SIMPLE NON GLOBAL'){
                let a = 0
                let it = 0
                let er = 0
                let aa = 0
                let aaa = 0
                let aaaa = 0
                let index_file = 0
                al.file.forEach((f,key) =>{
                    
                    if (f["ACCOUNT CODE"] == 'TOTAL EXPENSE')
                        a = 1
                        y = 1
                    if (f["ACCOUNT CODE"] == 'TOTALE')
                        er = 1
                    if (f["DESCRIPTION"] == 'TICKETS SOLD')
                        aa = 1
                    if (f["ACCOUNT CODE"] == 'NUM_1')
                        aaa = 1
                    if (f["ACCOUNT CODE"] == 'TOTAL_DAR')
                        aaaa = 1

                    if (a == 0 && f["ACCOUNT CODE"] != 'TOTAL EXPENSE') {
                        
                        total_expenses  = total_expenses + parseFloat(f["EXPENSE"]?f["EXPENSE"]:0)
                        total_income  = total_income + parseFloat(f["INCOME"]?f["INCOME"]:0)
                        
                    }

                    if (aa == 1 && er == 0) {
                        total_extra_expenses  = total_extra_expenses + parseFloat(f["EXPENSE"]?f["EXPENSE"]:0)
                        total_extra_income  = total_extra_income + parseFloat(f["INCOME"]?f["INCOME"]:0)
                        
                    }
                    if (er == 1 && aaaa == 1 && !isNaN(f["INCOME"]) ) {
                        
                        total_extra_expenses_dar  = total_extra_expenses_dar + parseFloat(f["EXPENSE"]?f["EXPENSE"]:0)
                        total_extra_income_dar  = total_extra_income_dar + parseFloat(f["INCOME"]?f["INCOME"]:0)
                        
                    }
                    
                    if (f["ACCOUNT CODE"] == el["ACCOUNT CODE"] && el["ACCOUNT CODE"] != 'NUM' && f["ACCOUNT CODE"] != 'TOTAL EXPENSE'  && f["ACCOUNT CODE"] != 'TOTAL_DAR') {
                        it = 1
                        let r = al?.namefile
                        cumul.push({
                            'INCOME':parseFloat(f["INCOME"]?f["INCOME"]:0),
                            'EXPENSE':parseFloat(f["EXPENSE"]?f["EXPENSE"]:0),
                            'f':f["ACCOUNT CODE"]
                        })

                        $(`#ff${el["ACCOUNT CODE"]}`).append(`
                            <td id='td_nomglobal${ui}' onclick='emma("${ui}")'  style='font-weight: ${(f["ACCOUNT CODE"]=='TOTALE' || f["ACCOUNT CODE"]=='TOTAL_DAR' )?'bold':''} ;' >${parseFloat((a!=1)?(f["EXPENSE"]?f["EXPENSE"]:0):(f["INCOME"]?f["INCOME"]:0)).toFixed(2)}</td>
                            <input type="number" id="input_expense${ui}" value="${f["EXPENSE"]?f["EXPENSE"]:0}" hidden />
                            <input type="number" id="input_income${ui}" value="${f["INCOME"]?f["INCOME"]:0}" hidden />                 
                        `)
                        // onclick popup the prompt
                        $("#td_nomglobal"+ui).click(()=>{
                            console.log( $("#uppy").val())
                            ui =  $("#uppy").val()
                            PromptMessage(`td_nomglobal${ui}`,"input_expense"+ui,"input_income"+ui,f["EXPENSE"]?f["EXPENSE"]:0,f["INCOME"]?f["INCOME"]:0,al.namefile,key)
                                 
                        })
                        ui++ 
                        
                    }

                    
                    index_file++
                     
                    
                })
               
               
                if (it == 0 && el["ACCOUNT CODE"] != 'TOTAL_EXPENSE' && el["ACCOUNT CODE"] != 'TOTAL_DAR') {
                    $(`#ff${el["ACCOUNT CODE"]}`).append(`
                        ${(el["ACCOUNT CODE"] != 'NUM')?'<td>0</td>':'<td>AMOUNT_DAR</td>'}        
                    `)
                }

                total_cumul.push(cumul)
                if(el["ACCOUNT CODE"] == 'TOTAL_EXPENSE'){
                    if(a == 1)
                        cumul.push({
                            'INCOME':parseFloat(total_income).toFixed(2),
                            'EXPENSE':parseFloat(total_expenses).toFixed(2),
                            'f':el["ACCOUNT CODE"]
                        })
                    $(`#ff${el["ACCOUNT CODE"]}`).append(`
                            <td style='font-weight: bold;' >${total_expenses.toFixed(2)}</td>   
                                  
                    `)
                    
                }

                if(el["ACCOUNT CODE"] == 'TOTALE'){
                    $(`#fff${el["ACCOUNT CODE"]}`).append(`
                            <td style='font-weight: bold;' >${total_extra_income.toFixed(2)}</td>   
                                  
                    `)
                    
                }
                if(el["DESCRIPTION"] == 'TOTAL BALANCE'){
                    
                    $(`#ffwwf${el["ACCOUNT CODE"]}`).append(`
                            <td style='font-weight: bold;' >EXP : ${total_extra_expenses.toFixed(2) - total_expenses.toFixed(2)} / INC : ${total_extra_income.toFixed(2) - total_income.toFixed(2)}</td>   
                                  
                    `)
                    
                }
                if(el["DESCRIPTION"] == 'GLOBAL BALANCE CDF'){
                    $(`#fff${el["ACCOUNT CODE"]}`).append(`
                            <td style='font-weight: bold;' >EXP : ${total_extra_expenses.toFixed(2) - total_expenses.toFixed(2)} / INC : ${total_extra_income.toFixed(2) - total_income.toFixed(2)}</td>   
                                  
                    `)
                    
                }
                if(el["DESCRIPTION"] == 'GLOBAL BALANCE USD'){
                    $(`#fff${el["ACCOUNT CODE"]}`).append(`
                            <td style='font-weight: bold;' >EXP : ${(total_extra_expenses.toFixed(2) - total_expenses.toFixed(2))/2040} / INC : ${(total_extra_income.toFixed(2) - total_income.toFixed(2))/2040}</td>   
                                  
                    `)
                    
                }
                if(el["ACCOUNT CODE"] == 'TOTAL_DAR'){
                    
                    $(`#ff${el["ACCOUNT CODE"]}`).append(`
                            <td style='font-weight: bold;' >EXP : ${total_extra_expenses_dar.toFixed(2)} / INC : ${total_extra_income_dar.toFixed(2)}</td>   
                                  
                    `)
                    
                }
            }

            if(al.type == 'GLOBAL'){
                global_file = al

            }

            index++
            let total_cumul_array = []
            // cumul
            if (index == document.length) {
                
                let exp = 0
                let inc = 0
                let f = ''
                let g = ''
                let ema = 0
                total_cumul.forEach( cumul =>{  
                    cumul.forEach(element => {
                        exp = exp + parseFloat(element?.EXPENSE)
                        inc = inc + parseFloat(element?.INCOME)
                        f = element?.f
                        g = element?.GLOBAL
                    });
                    
                    
                })

                if (el["ACCOUNT CODE"] == 'TOTAL_EXPENSE') {
                        ema = 1
                }
                if(f == el["ACCOUNT CODE"] && el["ACCOUNT CODE"] != 'TOTAL EXPENSE'){
                    total_cumul_array.push({
                        'INCOME': inc,
                        'EXPENSE': exp
                    })
                    
                    $(`#ff${el["ACCOUNT CODE"]}`).append(`
                        <td style='font-weight: ${(el["ACCOUNT CODE"] == 'TOTAL_EXPENSE' || el["ACCOUNT CODE"] == 'TOTALE')?'bold':''} ;' >${parseFloat((inc == 0)?(exp):(inc)).toFixed(2)}</td>        
                    `)
                }
                        
                    
                
            }
            // global file
            if (index == document.length) {
                let it = 0
                let total_expenses = 0
                let total_income = 0
                let global_total_expenses = 0
                let global_total_income = 0
                let a = 0
                let i = 0
                global_file.file.forEach(f =>{
                    
                    if (f["ACCOUNT CODE"] == 'TOTAL EXPENSE')
                        a = 1
                        y = 1
                    
                    if (a == 0) {
                        
                        total_expenses  = total_expenses + parseFloat(f["EXPENSE"]?f["EXPENSE"]:0)
                        total_income  = total_income + parseFloat(f["INCOME"]?f["INCOME"]:0)
                        global_total_expenses = global_total_expenses + parseFloat((f["EXPENSE"]?f["EXPENSE"]:0) - total_cumul_array[i]?.EXPENSE)
                        global_total_income = global_total_income + parseFloat((f["INCOME"]?f["INCOME"]:'')-total_cumul_array[i]?.INCOME)
                    }

                    let dif_exp = (f["EXPENSE"]?f["EXPENSE"]:0) - total_cumul_array[i]?.EXPENSE
                    let dif_inc = (f["INCOME"]?f["INCOME"]:'')-total_cumul_array[i]?.INCOME
                    
                    if (f["ACCOUNT CODE"] == el["ACCOUNT CODE"] && f["ACCOUNT CODE"]!='NUM') {
                        it = 1
                        $(`#ff${el["ACCOUNT CODE"]}`).append(`
                            ${(f["ACCOUNT CODE"]=='TOTALE' || f["ACCOUNT CODE"]=='TOTAL_DAR' )?`<td style='font-weight: bold;' >${parseFloat((a!=1)?(f["EXPENSE"]?f["EXPENSE"]:0):(f["INCOME"]?f["INCOME"]:0)).toFixed(2)}</td>`:`<td>${parseFloat((a!=1)?(f["EXPENSE"]?f["EXPENSE"]:''):(f["INCOME"]?f["INCOME"]:'')).toFixed(2)}</td>`}
                                               
                        `)
                        //DIFFERENCE
                        $(`#ff${el["ACCOUNT CODE"]}`).append(`
                            <td style='background-color : ${(dif_exp !=0 || dif_inc !=0 )? 'rgb(222, 179, 179)':'white'}' >${parseFloat((a!=1)?((f["EXPENSE"]?f["EXPENSE"]:0) - total_cumul_array[i]?.EXPENSE):((f["INCOME"]?f["INCOME"]:'')-total_cumul_array[i]?.INCOME)).toFixed(2)}</td>        
                        `)
                        i++
                    }
                    if(f["ACCOUNT CODE"] == el["ACCOUNT CODE"] && f["ACCOUNT CODE"]=='NUM'){
                        it = 1
                        
                        $(`#ff${el["ACCOUNT CODE"]}`).append(`
                                <td style='font-weight: bold;' >${f["EXPENSE"]?f["EXPENSE"]:''} ${f["INCOME"]?f["INCOME"]:''}</td>        
                            `)
                            //DIFFERENCE
                            $(`#ff${el["ACCOUNT CODE"]}`).append(`
                            <td >EXP : ${(f["EXPENSE"]?f["EXPENSE"]:0) - total_cumul_array[i]?.EXPENSE} / INC : ${(f["INCOME"]?f["INCOME"]:'')-total_cumul_array[i]?.INCOME}</td>        
                        `)
                        i++
                    }
                                
                    
                })
                total_cumul.push(cumul)
                if(el["ACCOUNT CODE"] == 'TOTAL_EXPENSE'){
                    console.log(total_income)
                    if(a == 1)
                        cumul.push({
                            'INCOME':parseFloat(total_income).toFixed(2),
                            'EXPENSE':parseFloat(total_expenses).toFixed(2),
                            'f':el["ACCOUNT CODE"]
                        })
                    $(`#ff${el["ACCOUNT CODE"]}`).append(`
                            <td style='font-weight: bold;' >${(true)?total_expenses.toFixed(2):total_income.toFixed(2)}</td>   
                                  
                    `)
                    $(`#ff${el["ACCOUNT CODE"]}`).append(`
                            <td style='font-weight: bold;' >${(true)?global_total_expenses.toFixed(2):global_total_income.toFixed(2)}</td>   
                                  
                    `)
                }
                if(el["ACCOUNT CODE"] == 'TOTAL_DAR'){
                    
                    $(`#ff${el["ACCOUNT CODE"]}`).append(`
                            <td style='font-weight: bold;' >EXP : ${total_extra_expenses_dar.toFixed(2)} / INC : ${total_extra_income_dar.toFixed(2)}</td>   
                                  
                    `)
                    
                }
                if (it == 0 && el["ACCOUNT CODE"] != 'TOTAL_EXPENSE' && el["ACCOUNT CODE"] != 'TOTAL_DAR') {
                    $(`#ff${el["ACCOUNT CODE"]}`).append(`
                        ${(el["ACCOUNT CODE"] != 'NUM')?'<td>0.00</td>':'<td>AMOUNT_DAR</td>'}        
                    `)
                }
            }
            // DIFFERENCE
            if (index == document.length) {

            }
            
            
        })

        
    })

    // add header 
    let ind = 0
    document.forEach(al =>{
        ind++
        
        if(al.type == 'SIMPLE NON GLOBAL')
            $('#ke').append(`
                <th scope="col" STYLE='text-align:center'>${al?.namefile}
                <p STYLE='text-align:center'>EXPENSE/INCOME</P>
                </th>
            `)

        if (ind == document.length) {
            $('#ke').append(`
                <th scope="col" STYLE='text-align:center'>CUMUL
                <p STYLE='text-align:center'>EXPENSE/INCOME</P>
                </th>
            `)
            $('#ke').append(`
                <th scope="col" STYLE='text-align:center'>${global_file?.namefile}
                <p STYLE='text-align:center'>EXPENSE/INCOME</P>
                </th>
            `)
            $('#ke').append(`
                <th scope="col" STYLE='text-align:center'>DIFFERENCE
                <p STYLE='text-align:center'>EXPENSE/INCOME</P>
                </th>
            `)
        }
    })

    //console.log(document[0]['file'])
    
})

$('.addfile').click(()=>{
    $("#gridfile").show('')
    $('#grid').show('')
    $('#gridfile').show('')
    $('#dd').show('')
    $('#rose').hide('')
    $('#rere').hide('')
})

if ($('#update').val() == 'update') {
    $('#grid').hide('')
    $('#gridfile').hide('')
    $('#dd').hide('')
    $('#rose').show('')
}


// print table 

function printData(id)
{
   var newWin= window.open("");
   newWin.document.write($(id).prop('outerHTML'));
   newWin.print();
   newWin.close();
}

$('.button').on('click',function(){
printData('#rose');
})

$('#ppp').on('click',function(){
    printData('#rere');
    })


// refresh the page



$('.refresh').on('click',function(){
    window.location=`http://app.classiccoachtransport.com/grid/uploadfile.php?id_doc=${$('#id_doc').val()}&name=${$('#name').val()}&update=update`
})
      
const PromptMessage = async (id_td,input_expense,input_income,expe,inco,namefile,index_fil) => {
    

    var expense = prompt("EXPENSE :", `${expe}`)
    var income = prompt("INCOME :", `${inco}`)
    $(`#${input_expense}`).val(expense?expense:expe)
    $(`#${input_income}`).val(income?income:inco)
    $(`#${id_td}`).html(`${((expense?expense:expe) == 0)? parseFloat(income?income:inco).toFixed(2):parseFloat(expense?expense:expe).toFixed(2)}`)
    
    //check if doc exist
    let getit = null
    const q = query(collection(db, "files"), where("namefile", "==", namefile));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
    
        getit = {id_doc_file : doc.id,...doc.data()}

    });
    if(getit){
       
        getit.file[index_fil].EXPENSE = expense?expense:expe
        getit.file[index_fil].INCOME = income?income:inco
        const updateit = await setDoc(doc(db, "files", getit.id_doc_file), getit);
        
    }else{
        
    }
}

    
const PromptMessageSelf = async (id_td,amount,type,namefile,index_fil) => {
    

    var expense = prompt("AMOUNT :", `${amount}`)
    $(`#${id_td}`).html(`${(expense?expense:amount)}`)
    
    //check if doc exist
    let getit = null
    const q = query(collection(db, "files"), where("namefile", "==", namefile));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
    
        getit = {id_doc_file : doc.id,...doc.data()}

    });
    if(getit){
        if (type == 'EXPENSE') {
            getit.file[index_fil].EXPENSE = expense?expense:amount
        }
        if (type == 'INCOME') {
            getit.file[index_fil].INCOME = expense?expense:amount
        }
        
        const updateit = await setDoc(doc(db, "files", getit.id_doc_file), getit);
        
    }else{
        
    }
}
