<?php
/*分页显示菜品,每页最多显示5——以JSON格式*/
header('Content-Type:application/json');

//接收客户端提交的数据
@$start = $_REQUEST['start'];//从哪一行开始读取记录 @表示压制当前行所产生的所有警告
if( !isset($start) ){
    $start = 0; //若客户端未提交start请求参数,则默认设置为0
}
$count = 5; //一次可以向客户端返回最大的记录数

//执行数据库操作
$conn = mysqli_connect('127.0.0.1','root','','kaifanla');
$sql = "SET NAMES UTF8";
mysqli_query($conn,$sql);
$sql = "SELECT did,name,price,material,img_sm FROM kf_dish LIMIT $start,$count";
$result = mysqli_query($conn,$sql);

$output = [];//用于保存所有记录的数组
while( ($row=mysqli_fetch_assoc($result))!==NULL ){
    $output[] = $row;
}

sleep(1);
//向客户端输出响应消息主体
$jsonString = json_encode($output);
echo $jsonString;
?>