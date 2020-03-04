package de.trabit.reportApp.shared

import com.example.api_test.dataClasses.Metadata

open class Votable (open val _id: String = "",
                    open val metadata: Metadata = Metadata(),
                    open val resourceName : String = "") {
}