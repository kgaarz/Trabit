package com.example.api_test.dataClasses

data class Metadata (val upvotes : Votes = Votes(),
                     val downvotes : Votes = Votes(),
                     val active : Boolean = true,
                     val verified : Boolean = false){
}