<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://unpkg.com/xlsx/dist/xlsx.full.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
    <script type="module" defer src="./file.js"></script>
    <script type="module" defer src="./module.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <link href="../style.css" rel="stylesheet" >

    <title>classic</title>
</head>
<body>


    <style>
        td{
            cursor: pointer;
        }
    </style>
                    
    <div style="display: flex;justify-content: space-between;width: 100%;height: auto;">
        <div style="width: 20%;background-color: bisque;">
            <img src="../classiclogo.png" style="width: 30%;padding-left: 10px;" />
            <div style="background-color: white;margin-top: 1%;">
                <input type="text" id="namefolder1" class="form-control" value="<?php echo $_GET['name']; ?>" placeholder="Enter the Name of the folder : " style="margin-top: 10px;"/>
                <div class="upload1" style="display: flex;margin-top: 10px;background-color: rgb(236, 189, 133);cursor: pointer;">
                    <img src="../imgs/folder.png" style="width: 30px;height: 30px;" />
                    <p>UPDATE FOLDER</p>
                </div>
                <div  class="addfile" style="display: flex;margin-top: 10px;background-color: rgb(236, 189, 133);cursor: pointer;">
                    <img src="../imgs/document.png" style="width: 30px;height: 30px;" />
                    <p>FILES</p>
                </div>
                <div  class="listoffiles" style="display: flex;margin-top: 10px;background-color: rgb(236, 189, 133);cursor: pointer;">
                    <img src="../imgs/calculator.png" style="width: 30px;height: 30px;" />
                    <p>CALCULATOR</p>
                </div>
                <div  class="button" style="display: flex;margin-top: 10px;background-color: rgb(236, 189, 133);cursor: pointer;">
                    <img src="../imgs/printer.png" style="width: 30px;height: 30px;" />
                    <p>PRINT</p>
                </div>
                <div  class="refresh" style="display: flex;margin-top: 10px;background-color: rgb(236, 189, 133);cursor: pointer;">
                    <img src="../imgs/refresh.png" style="width: 30px;height: 30px;" />
                    <p>REFRESH</p>
                </div>
                
                <div onclick="window.close()" class="upload2" style="display: flex;margin-top: 10px;background-color: rgb(236, 189, 133);cursor: pointer;">
                    <img src="../imgs/close.png" style="width: 30px;height: 30px;" />
                    <p>CLOSE</p>
                </div>
                
            </div>
        </div>
        <div id='xx'  style="width: 80%;height:500px;overflow-y: scroll;">
            <div id="grid">
                <div class="file" style="display: flex;flex-wrap: wrap;">
                    <div  style="margin-left: 10px;">
                        <img src="../imgs/loading.gif" style="width: 100%;cursor: pointer;" id='loading'/>
                        
                    </div>
                    
                    
                    
                </div>
            </div>
            <div style='display:flex;justify-content:space-between;'>
            <div id='gridfile' style='margin-top: 20px;width:50%;margin-left:3%;background-color:#eee;padding:10px;'>
                <h1 STYLE='text-align:center'>ADD FILE</h1>
                <div class="input-group mb-3">
                    <span class="input-group-text" id="basic-addon1">File Name</span>
                    <input type="text" id='filename' class="form-control" aria-label="Username" aria-describedby="basic-addon1">
                </div>

                <div style="border: 1px solid whitesmoke; padding-bottom: 10px;">
                <label for="">Select the type of the file to be uploaded:</label>
                    <select style='width:70%;' id='type' class="form-select" aria-label="Default select example" style='margin-top:20px;margin-bottom:30px;'>
                        <option id='vv'></option>
                        <option>SIMPLE NON GLOBAL</option>
                        <option>GLOBAL</option>
                        <option>COMPARAISON</option>
                    </select>
                    <label for="">Select the file to be uploaded: (file.xlsx) </label>
                    <br>
                    <br>
                    <input type="file" class="btn btn-secondary" id="file-import-json" accept=".xlsx" style="padding-bottom: 10px;">
                </div>

            </div>
            <div id='rere' style='padding:10px;' ></div>
            <img src="../imgs/printer.png" style="width: 30px;height: 30px;cursor:pointer;margin-top:15px;" id='ppp'/>
            <div id='dd' style='margin-top: 20px;width:40%;margin-right:3%;background-color:#eee;padding:10px;' >
                <h1 STYLE='text-align:center' >LIST OF FILES </h1>
                <div id='filllist' style=''>
                    <img src="../imgs/loading.gif" style="width: 100%;cursor: pointer;" id='loading'/>
                </div>

            </div>
            </div>

            <div id='rose' style='padding: 20px;display:flex;flex-direction:column;justify-content:center;'>
            
                <div style='display:flex;justify-content:center'>
                    <img src="../classiclogo.png" style="width: 50px;margin-top:-10px;"/>
                    <img src="../imgs/titre.png" style="width: 40%;height:30px;" />
                </div>
                <div id='cx' style='text-align:center;padding: 20px;'>
                    <p>Id. Nat: 6-93-N 63118 H   RCCM : 14-A-0874</p>
                    <p style='margin-top:-15px;'>503, Av. MOERO & 1567, Av. KASAVUBU / Commune de Lubumbashi</p>
                    <p style='margin-top:-15px;border: 1px solid black;padding:5px;'>VERIFICATION COHERENCE RAPPORT CLASSIC </p>

                    <table >
                        <thead>
                            <tr id='ke'>
                                <th scope="col">ACCOUNT CODE</th>
                                <th scope="col">DESCRIPTION</th>
                            </tr>
                        </thead>
                        <tbody id='ll'>
                            
                        </tbody>
                    </table>
                </div>


            </div>
        </div>
    </div>

    <input type='text' id='id_doc' value="<?php echo $_GET['id_doc']?>" hidden/>
    <input type='text' id='name' value="<?php echo $_GET['name']?>" hidden/>
    <input type='text' id='update' value="<?php if (isset($_GET['update'])) { echo $_GET['update']; }else{echo '';} ?>" hidden/>

    <input type='text' id='upp' value="" hidden/>
    <input type='text' id='uppy' value="" hidden/>


    <script>
        
       function emma(a) {
            $("#uppy").val(a)
            
       }
    </script>
    
</body>
</html>
