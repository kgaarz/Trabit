package de.trabit.reportApp

//This is the dataclass of the Reportitems in the Recyclerview on the OverviewActivity

data class ReportItem (

    var dayText :String,
    var timeText :String,
    var usernameText :String,
    var idText :String,
    var reportText :String,
    var commentAmount : String,
    var confirmIndex : String
){

}