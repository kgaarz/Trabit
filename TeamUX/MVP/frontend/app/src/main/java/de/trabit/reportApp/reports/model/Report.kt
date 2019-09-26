package com.example.api_test.dataClasses

import de.trabit.reportApp.shared.Votable
import java.util.*
import kotlin.collections.ArrayList

class Report (_id : String = "",
              val author : String = "",
              val description : String = "",
              val location : LocationObject = LocationObject(),
              val transport : Transport = Transport(),
              metadata : Metadata = Metadata(),
              val comments : ArrayList<Comment> = ArrayList(),
              val created : Date = Date(),
              val modified : Date = Date(),
              resourceName : String = "reports") : Votable(_id, metadata, resourceName)  {
}