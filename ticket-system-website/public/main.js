import { file2DataURI } from './util.js'

window.addEventListener('DOMContentLoaded', () => {
	console.log('DOMContentLoaded')
	if(document.querySelector('input[type="file"]')!=null){
		document.querySelector('input[type="file"]').addEventListener('change', (event) => showUploadedFile(event))
	}
})

/**
 * This function shows a little preview of the uploaded file
 * @param {event} the event where it got triggered
 * @returns {none} void function
 */
async function showUploadedFile(event) {
	console.log('ADD COVER FILE')
	const files = event.target.files
	const file =files[0]
	if (file){
		const data = await file2DataURI(file)
		const img=document.querySelector('form img')
		img.src=data
		document.getElementById("eventImage").value=data
	}
}


