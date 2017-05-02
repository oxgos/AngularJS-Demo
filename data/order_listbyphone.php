<?php
/*根据客户端提交的电话号码,返回其所下的所有订单—以JSON格式*/
header('Content-Type:application/json');

//接收客户端提交的数据
@$phone = $_REQUEST['phone'];//从哪一行开始读取记录 @表示压制当前行所产生的所有警告
if( !isset($phone) ){
    echo '[]';
    return;//若客户端未提交电话号码,则返回一个空数组
}

//执行数据库操作
$conn = mysqli_connect('127.0.0.1','root','','kaifanla');
$sql = "SET NAMES UTF8";
mysqli_query($conn,$sql);
$sql = "SELECT o.did,o.user_name,o.order_time,d.img_sm FROM kf_order o,kf_dish d WHERE o.phone=$phone AND o.did=d.did";
$result = mysqli_query($conn,$sql);

$output = [];//用于保存所有记录的数组
while( ($row=mysqli_fetch_assoc($result))!==NULL ){
    $output[] = $row;
}


//向客户端输出响应消息主体
$jsonString = json_encode($output);
echo $jsonString;
?>