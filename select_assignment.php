<?php

// Path to config file
include('database_config.php');


// Connect to database
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Search available conditions from database
$student_query = "SELECT * FROM student_assignments_v1 WHERE assigned IS NULL AND completed IS NULL LIMIT 1;";
$result = $conn->query($student_query);
$row = $result->fetch_assoc();

// Mark entry as assigned
$student_id = $row['student_id'];
$worker_id = $data_array[0]['worker_id'];

$assign_query="UPDATE student_assignments_v1 SET assigned = '" . $_GET['workerId'] . "' WHERE student_id = " . $student_id;
$assign_result=$conn->query($assign_query);

// DATA TO BE SENT
echo json_encode($row);

// Close connection
$conn->close();
?>