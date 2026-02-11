<?php
require_once "config.php";

// Create database connection
$db = new Database();
$conn = $db->connect();

// Function to display a table's data
function displayTable($conn, $tableName) {
    echo "<h2>Table: $tableName</h2>";

    $result = $conn->query("SELECT * FROM `$tableName`");

    if ($result->num_rows > 0) {
        echo "<table border='1' cellpadding='5' cellspacing='0'>";
        
        // Table headers
        echo "<tr>";
        while ($field = $result->fetch_field()) {
            echo "<th>" . htmlspecialchars($field->name) . "</th>";
        }
        echo "</tr>";

        // Table rows
        $result->data_seek(0); // reset pointer
        while ($row = $result->fetch_assoc()) {
            echo "<tr>";
            foreach ($row as $value) {
                echo "<td>" . htmlspecialchars($value) . "</td>";
            }
            echo "</tr>";
        }

        echo "</table><br><br>";
    } else {
        echo "<p>No records in this table.</p>";
    }
}

// Get all tables in the database
$tablesResult = $conn->query("SHOW TABLES");

if ($tablesResult->num_rows > 0) {
    while ($tableRow = $tablesResult->fetch_array()) {
        $tableName = $tableRow[0];
        displayTable($conn, $tableName);
    }
} else {
    echo "<p>No tables found in the database.</p>";
}

// Close connection
$db->disconnect();
?>
