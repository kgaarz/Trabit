package de.trabit.reportApp

import android.view.View
import androidx.core.content.ContextCompat
import com.google.android.material.snackbar.Snackbar

class ErrorSnackbar (val view : View) {
    fun show(message : String) {
        val snackbar = Snackbar.make(this.view, message, Snackbar.LENGTH_INDEFINITE).setAction("OK"){}
        val colorRed = ContextCompat.getColor(this.view.context, R.color.errorRed)
        val colorWhite = ContextCompat.getColor(this.view.context, R.color.colorWhite)
        snackbar.view.setBackgroundColor(colorRed)
        snackbar.setActionTextColor(colorWhite)
        snackbar.show()
    }
}