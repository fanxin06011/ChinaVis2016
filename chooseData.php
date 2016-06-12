 
<?php
error_reporting(E_ALL & ~E_DEPRECATED);
error_reporting(E_ALL || ~E_NOTICE);
header('Content-Type: text/json');
header("Cache-Control: no-cache, must-revalidate");
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

$timestart=$_POST["timestart"];
$timeend=$timestart+3600;
$idlist=$_POST["idlist"];
$vciselected=$_POST["vciselected"];
$vpiselected=$_POST["vpiselected"];
$portselected=$_POST["portselected"];
$idflag=$_POST["idflag"];
$portflag=$_POST["portflag"];
$vciflag=$_POST["vciflag"];
$vpiflag=$_POST["vpiflag"];

$con = mysqli_connect('localhost', 'vis2016', 'vis2016');

if (!$con)
 {
 die("Connection failed: " . mysqli_connect_error());
 }
mysqli_select_db($con,"vis");
$sql="SELECT ID,FILELEN,SRCPORT,DSTPORT,TIMEINT,VCI1,VPI1,ATM1AALTYPE,SRCID,DSTID FROM data3 WHERE (TIMEINT>=".$timestart." and TIMEINT<= ".$timeend.")";
if($idflag==1){
	$sql=$sql." AND (SRCID IN(".$idlist.") OR DSTID IN(".$idlist."))";
}
if($portflag==1){
	$sql=$sql." AND (SRCPORT =".$portselected." OR DSTPORT =".$portselected.")";
}
if($vciflag==1){
	$sql=$sql." AND VCI1 =".$vciselected."";
}
if($vpiflag==1){
	$sql=$sql." AND VPI1 =".$vpiselected."";
}
//echo $sql;
$result =  mysqli_query($con,$sql);
//echo $result;
$i=0;
$res=array();


while($row = mysqli_fetch_array($result)){
	$res[$i]=array(
		"ID"=>$row['ID'],
		"FILELEN"=>$row['FILELEN'],
		"TIMEINT"=>$row['TIMEINT'],
		"SRCID"=>$row['SRCID'],
		"DSTID"=>$row['DSTID'],
		"SRCPORT"=>$row['SRCPORT'],
		"DSTPORT"=>$row['DSTPORT'],
		"VCI1"=>$row['VCI1'],
		"VPI1"=>$row['VPI1'],
		"ATM1AALTYPE"=>$row['ATM1AALTYPE']
    );
    $i=$i+1;
}

$json_string = json_encode($res);
  
echo $json_string;

mysqli_close($con);



?>