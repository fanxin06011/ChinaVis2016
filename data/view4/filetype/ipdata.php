 
<?php
error_reporting(E_ALL & ~E_DEPRECATED);
error_reporting(E_ALL || ~E_NOTICE);
header('Content-Type: text/json');
header("Cache-Control: no-cache, must-revalidate");
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");


$ip=$_GET["ipselected"];
$SrcOrDst=$_GET["SrcOrDst"];//0-src 1-dst


$con = mysqli_connect('localhost', 'vis2016', 'vis2016');

if (!$con)
 {
 die("Connection failed: " . mysqli_connect_error());
 }
mysqli_select_db($con,"vis");
if($SrcOrDst==0){
    $sql="SELECT TIMEINT FROM vis.data3 WHERE SRCID=".$ip;
}else{
	$sql="SELECT TIMEINT FROM vis.data3 WHERE DSTID=".$ip;
}

$result =  mysqli_query($con,$sql);

$i=0;
$res=array();
$cnt=array();
$time=0;
$tt=0;
for($i=0;$i<53;$i++){
	$cnt[$i]=array();
	for($j=0;$j<24;$j++){
		$cnt[$i][$j]=0;
	}
}

while($row = mysqli_fetch_array($result)){
	while($row['TIMEINT']>$time+3600){
		$time=$time+3600;
		$tt=($tt+1)%24;
	}
	$d=floor($time/86400);
	$cnt[$d][$tt]=$cnt[$d][$tt]+1;
}



$res=array("cnt"=>$cnt);
$json_string = json_encode($res);
  
echo $json_string;
mysqli_close($con);



?> 
