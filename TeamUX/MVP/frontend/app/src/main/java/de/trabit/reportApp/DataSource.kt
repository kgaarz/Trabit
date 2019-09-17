package de.trabit.reportApp

class DataSource{

    companion object {

        fun createDataSet(): ArrayList<ReportItem> {
            //ArrayList Reports
            val reportList = ArrayList<ReportItem>()
            reportList.add(
                ReportItem(
                    "heute", "10.00 Uhr", "MaxMustermann", "RB25", "Gleiswechsel"
                )
            )
            reportList.add(
                ReportItem(
                    "heute", "10.00 Uhr", "MaxMustermann", "RB25", "Gleiswechsel"
                )
            )
            reportList.add(
                ReportItem(
                    "heute", "10.00 Uhr", "MaxMustermann", "RB25", "Gleiswechsel"
                )
            )
            reportList.add(
                ReportItem(
                    "heute", "10.00 Uhr", "MaxMustermann", "RB25", "Gleiswechsel"
                )
            )

            return reportList
        }

    }
}