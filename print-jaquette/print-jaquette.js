/******** Génération des jaquettes sur les notices longues *********/

// Get infos Jaquettes
function processInfosJaquettes(){

    let title = $('#titre_uni .titre_principal').text()
    let type  = $('.item-Type').text().match(/[a-zA-Zàâäéèêëùîïç]+\s[a-zA-Zàâäéèêëùîïç]+/)[0]

    let regexDocnum = /\d+/
    let docNum      = $('.numero_notice p:first-child').text().match(regexDocnum)[0]

    let regexDate       = /[a-z]{0,2}\s\d{0,2}\s[a-zA-Zàâäéèêëùîïç]+\s\d{4}/
    let infosConcert    = $('#author').text()
    let dateConcert     = infosConcert.match(regexDate)[0]
    let regexCleanSalle = 'Concert enregistré à la '
    let regexCleanSalleOut = ' - Philharmonie'
    let salleConcert    = infosConcert.replace(regexDate, '').replace(regexCleanSalle, '').replace(regexCleanSalleOut, '')

    let urlImage     = $('.numero_notice a.hideSaufPAD').attr('href')

    let regexCleanLinkIn  = /<a.+">/
    let regexCleanLinkOut = /<\/a>/
    
    let participantsRaw   = document.getElementById('mention-resp').getElementsByTagName('li')
    let pa = []

    participantsRaw.forEach(elt => {
        pa.push(elt.innerText.replace(regexCleanLinkIn, '').replace(regexCleanLinkOut, ''))
    })
    let participants = pa.join(', ')


    let programmeRaw = $('#liste_plage .tarzan')
    let programme = []
    for (var i = 0; i < programmeRaw.length; i++){
        programme.push('<li>' + programmeRaw[i].innerText.replace(regexCleanLinkIn, '').replace(regexCleanLinkOut, '') + '</li>')
    }
    if( programme.length > 3 ){
        programme[3] = '<p><stong>...</strong><br/>Programme complet disponible en ligne</p>'
    }
    programme = programme.slice(0,4)
    function Jaquette(title, type, docNum, dateConcert, salleConcert, urlImage, participants, programme){
        this.title        = title
        this.type         = type
        this.docNum       = docNum
        this.dateConcert  = dateConcert
        this.salleConcert = salleConcert
        this.urlImage     = urlImage
        this.participants = participants
        this.programme    = programme
    }
    jaquette = new Jaquette(title, type, docNum, dateConcert, salleConcert, urlImage, participants, programme)
    return jaquette
}

// Create Jaquette Layout
function createJaquette(data){
    var layout = document.createElement('article')
    layout.className = 'body-jaquette'
    let contentRecto = `
        <section class="recto">
            <aside class="infos">
                <img class="logo" src="https://pad.philharmoniedeparis.fr/ui/skins/MEDIA/jaquettes/logoPAD.svg" alt=""/>
                <div class="overlay-logo"></div>
                <div class="cartouche right">
                    <p class="numeroConcert">Numéro du concert : <span class="docNum">${data.docNum}</span></p>
                </div>
                <div class="cartouche left">
                    <p class="type">${data.type}</p>
                    <h2 class="title">${jaquette.title}</h2>
                </div>
                <div class="crop-image">
                    <img class="imageConcert" src="${data.urlImage}"/>
                </div>
            </aside>
            <aside class="tuto">
                <ul>
                    <li>
                        <img src="https://pad.philharmoniedeparis.fr/ui/skins/MEDIA/jaquettes/user.svg" alt=""/>
                        <p class="connect"><strong>Connectez-vous</strong> sur<br/> pad.philharmoniedeparis.fr*</p>
                    </li>
                    <li><img src="https://pad.philharmoniedeparis.fr/ui/skins/MEDIA/jaquettes/chevron-jaquette.svg" alt=""/></li>
                    <li>
                        <img src="https://pad.philharmoniedeparis.fr/ui/skins/MEDIA/jaquettes/search.svg" alt=""/>
                        <p class="search"><strong>Entrez le numéro du concert</strong> dans la barre de recherche</p>
                    </li>
                    <li><img src="https://pad.philharmoniedeparis.fr/ui/skins/MEDIA/jaquettes/chevron-jaquette.svg" alt=""/></li>
                    <li>
                        <img src="https://pad.philharmoniedeparis.fr/ui/skins/MEDIA/jaquettes/run.svg" alt=""/>
                        <p class="run">Sélectionnez et <br/><strong>visionnez le concert</strong></p>
                    </li>
                </ul>
                <p class="legende">* Si vous n'avez pas encore de compte, adressez-vous à votre bibliothèque</p>
            </aside>
        </section>
    `

    let contentVerso = ` 
        <section class="verso">
            <article class="encart">
                <p>${data.salleConcert}</p>
                <p>${data.dateConcert}</p>
                <p class="participants">${data.participants}</p>
                <h3>Programme</h3>
                <ol class="programme">
                    ${data.programme.join(' ')}
                </ol>
            </article>
            <img class="logo" src="https://pad.philharmoniedeparis.fr/ui/skins/MEDIA/jaquettes/logoPADblack.svg" alt=""/>
            <p class="link">pad.philharmoniedeparis.fr</p>
        </section>

    `
    layout.innerHTML = contentRecto + contentVerso
    let checkJaquette = $('.body-jaquette')
    if (checkJaquette.length == 0){
        document.getElementsByClassName('pad')[0].appendChild(layout)
    }
}
$(document).ready( function(){
    //createJaquette(processInfosJaquettes())
    console.log('est')
    $('#printPdf').click( function(){

        $('body > *:not(.body-jaquette)').addClass('cl-print')
        createJaquette(processInfosJaquettes())
        window.print()
        window.onafterprint = function(){
            $('body > *').removeClass('cl-print')
         }
                


    })
    
})
