package com.example.api_test.dataClasses

data class Metadata (val upvotes : Int = 0,
                     val downvotes : Int = 0,
                     val active : Boolean = true,
                     val verified : Boolean = false){
}