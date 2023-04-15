 main()

async function main(){
  let currentActor = game.user.character;

  let targets = Array.from(game.user.targets);
  if(targets.length == 0){
    ui.notifications.error("Wybierz dokładnie jeden cel");
  }

  let currentTarget = targets[0].actor;
  //console.log(currentActor);
  //console.log(currentTarget);

  if(currentActor === currentTarget){
    ui.notifications.error("Bohater nie może być swoim własnym celem");
    return
  }
  
  let actorWeapons = currentActor.items.filter(item => item.system.attributes.typ?.value == "broń")
  console.log(actorWeapons);

  let keys = Object.keys(currentActor.system.attributes).filter(k => k.includes('um_sztuki_walki'))
  let atrybuty = keys.map(i=>currentActor.system.attributes[i])

  let options2 = ""
  for(let umiejki of atrybuty){
  options2 += `<option value=${umiejki.value} style="text-align:left">${umiejki.label} (${umiejki.value}%)</option>`
  }

  options3 = `<option value="">Wybierz</option>` + options2

  let options = ""
  for(let wep of actorWeapons){
    options += `<option value=${wep.id}>${wep.name} | ${wep.system.attributes.rodzaj.value}</option>`
  }

  let dialogTemplate = `
  <div style="display:flex; flex-direction: column;  line-height: 1">
    <div class="header-container">
      <h3 style="display: inline-block; text-align: center; width: 65%;">Broń</h3>
      <h3 style="display: inline-block; text-align: center; width: 30%;">Sztuki Walki</h3>
    </div>
    <div>
    <span style="display: inline-block; text-align: center; vertical-align: middle; width: 65%;">
      <select id="weapon" style="width: 90%; text-align: center;">${options}</select>
    </span>
    <span style="display: inline-block; text-align: center; vertical-align: middle; width: 30%;">
      <select id="sztukiWalki" style="width: 90%; text-align: center;">${options3}</select>
    </span>
    </div>  
    <hr>
    <h3 style="flex:1; text-align:center;line-height: 1.5">Opcjonalny modyfikator obrażeń</h3>
    <table style="border-width: 0; flex:1">
    <tr>
    <td style="flex:1; text-align:center; width: 25%">od demonów</td>
    <td style="flex:1; text-align:center; width: 25%">od wzmocnienia</td>  
    <td style="flex:1; text-align:center; width: 25%">od tatuaży</td> 
    <td style="flex:1; text-align:center; width: 25%">od mięsa demonów</td>
 </tr>
 <tr>
    <td><span style="flex:1; text-align:center; vertical-align: middle; display: flex; justify-content: center"><input  id="modBron" type="checkbox" unchecked/></span></td> 
    <td><span style="flex:1; text-align:center; vertical-align: middle; display: flex; justify-content: center"><input  id="modBronWzm" type="checkbox" unchecked/></span></td> 
    <td><span style="flex:1; text-align:center; vertical-align: middle; display: flex; justify-content: center"><input  id="modTatuaze" type="checkbox" unchecked/></span></td> 
    <td><span style="flex:1; text-align:center; vertical-align: middle; display: flex; justify-content: center"><input  id="modMieso" type="checkbox" unchecked/></span></td>
 </tr>
 </table>
    <h3 style="flex:1; text-align:center;line-height: 1.5">Modyfikator rzutu</h3>
    <span style="flex:1; line-height: 2; text-align:center; "><input  id="modifier"    type="number" value=0 style="width:40px; height:20px" /></span>
    </div>
    <hr>
  `

  new Dialog({
    title: "Atak",
    content: dialogTemplate,
    buttons: {
      rollAttack: {
        label: "Rzuć na atak",
        callback: async (html) => {
          let wepID = html.find("#weapon")[0].value;
          let weapon = currentActor.items.find(item => item.id == wepID)
          let modifier = html.find("#modifier")[0].value;
          let modBron = html.find("#modBron")[0].checked;
          let modBronWzm = html.find("#modBronWzm")[0].checked;
          let modTatuaze = html.find("#modTatuaze")[0].checked;
          let modMieso = html.find("#modMieso")[0].checked;
          let sztukiWalki = html.find("#sztukiWalki")[0].value;

          let characterMod = {};
          if (html.find("#modMieso")[0].checked){
            characterMod = currentActor.system.attributes.bon_m_mo?.value;
          } else if (html.find("#modTatuaze")[0].checked){
            characterMod = currentActor.system.attributes.bon_tr_mo?.value;
          } else if (html.find("#modBronWzm")[0].checked){
            characterMod = currentActor.system.attributes.bon_wbr_mo?.value;
          } else if (html.find("#modBron")[0].checked){
            characterMod = currentActor.system.attributes.bon_br_mo?.value;
          } else {
            characterMod = currentActor.system.attributes.po_modyfikator_obrazen.value;
          };

          let rollString = `d100 + ${modifier}`
          let roll = await new Roll(rollString).evaluate({async: true});
          console.log(roll.result);
          console.log(roll);

          let Umiejka1 = weapon.system.attributes.rodzaj.value;
          let Umiejka2 = {};
          if (Umiejka1 == "Kolna"){
              Umiejka2 = currentActor.system.attributes.um_bron_biala_kolna?.value;
            } else if (Umiejka1 == "Obuchowa"){
              Umiejka2 = currentActor.system.attributes.um_bron_biala_obuchowa?.value;
            } else if (Umiejka1 == "Sieczna"){
              Umiejka2 = currentActor.system.attributes.um_bron_biala_sieczna?.value;
            } else if (Umiejka1 == "Miotajaca"){
              Umiejka2 = currentActor.system.attributes.um_bron_dystansowa_miotajaca?.value;
            } else if (Umiejka1 == "Miotana"){
              Umiejka2 = currentActor.system.attributes.um_bron_dystansowa_miotana?.value;
            } else if (Umiejka1 == "Palna"){
              Umiejka2 = currentActor.system.attributes.um_bron_dystansowa_palna?.value;
            } else if (Umiejka1 == "Bijatyka"){
              Umiejka2 = currentActor.system.attributes.um_bijatyka?.value;
            } else if (Umiejka1 == "Rzucanie"){
              Umiejka2 = currentActor.system.attributes.um_rzucanie?.value;
            } else if (Umiejka1 == "Chwyty"){
              Umiejka2 = currentActor.system.attributes.um_chwyty?.value;
            } else if (Umiejka1 == "Walka tarcza"){
              Umiejka2 = currentActor.system.attributes.um_walka_tarcza?.value;
            }

          let tabelaKryt = {};
          if (Umiejka1 == "Kolna" || "Obuchowa" || "Sieczna" || "Walka tarcza"){
            tabelaKryt = `@UUID[RollTable.ETsuyqlY2ebk9muk]{Krytyczna porażka broni białej}`
          } else if (Umiejka1 == "Miotajaca" || "Miotana" || "Palna" || "Rzucanie"){
            tabelaKryt = `@UUID[RollTable.ZLzcbbvreqlmETsX]{Krytyczna porażka broni dystansowej}`
          } else if (Umiejka1 == "Bijatyka" || "Chwyty"){
            tabelaKryt = `@UUID[RollTable.wXwsMXWYNYW8OHwI]{Krytyczna porażka broni naturalnej}`
          };

          let chatContent = ""
          if(roll.total <= Math.floor(Umiejka2/20)){
            chatContent = `
            <p><strong style="text-align:center;
            min-width: 75%;
            display: flex; 
            color: #77356c;
            font-size: 21px;
            background-color: #d6d3c8;
            justify-content: center; 
            margin: 5px; 
            border: 1.5px solid #858581; 
            border-radius: 5px;">Krytyczny sukces!</strong><strong style="text-align:center;
            min-width: 20%;
            display: flex; 
            color: #393930;
            font-size: 20px;
            background-color: #d6d3c8; 
            justify-content: center; 
            margin: 5px; 
            border: 1.5px solid #858581; 
            border-radius: 5px;">${roll.total}</strong></p>
            <p style="text-align:center;
            color: #393930;
            font-size: 12px;
            vertical-align: middle;
            background-color: #d6d3c8;
            display: flex; 
            justify-content: center; 
            margin: 5px; 
            border: 1.5px solid #858581; 
            border-radius: 5px;">${roll.result}</p>
            <p><button id="rollDamage">Obrażenia</button></p>
            `
          } else if (roll.total <= Math.floor(Umiejka2/5)){
            chatContent = `
            <p><strong style="text-align:center;
            min-width: 75%;
            display: flex; 
            color: #346608;
            font-size: 21px;
            background-color: #d6d3c8;
            justify-content: center; 
            margin: 5px; 
            border: 1.5px solid #858581; 
            border-radius: 5px;">Wybitny sukces!</strong><strong style="text-align:center;
            min-width: 20%;
            display: flex; 
            color: #393930;
            font-size: 20px;
            background-color: #d6d3c8; 
            justify-content: center; 
            margin: 5px; 
            border: 1.5px solid #858581; 
            border-radius: 5px;">${roll.total}</strong></p>
            <p style="text-align:center;
            color: #393930;
            font-size: 12px;
            vertical-align: middle;
            background-color: #d6d3c8;
            display: flex; 
            justify-content: center; 
            margin: 5px; 
            border: 1.5px solid #858581; 
            border-radius: 5px;">${roll.result}</p>
            <p><button id="rollDamage">Obrażenia</button></p>
            `
          } else if (roll.total <= Umiejka2 && roll.total <= sztukiWalki && sztukiWalki > 0){
            chatContent = `
            <p><strong style="text-align:center;
            min-width: 75%;
            display: flex; 
            color: #1c4d3f;
            font-size: 21px;
            background-color: #d6d3c8;
            justify-content: center; 
            margin: 5px; 
            border: 1.5px solid #858581; 
            border-radius: 5px;">Podwójny sukces!</strong><strong style="text-align:center;
            min-width: 20%;
            display: flex; 
            color: #393930;
            font-size: 20px;
            background-color: #d6d3c8; 
            justify-content: center; 
            margin: 5px; 
            border: 1.5px solid #858581; 
            border-radius: 5px;">${roll.total}</strong></p>
            <p style="text-align:center;
            color: #393930;
            font-size: 12px;
            vertical-align: middle;
            background-color: #d6d3c8;
            display: flex; 
            justify-content: center; 
            margin: 5px; 
            border: 1.5px solid #858581; 
            border-radius: 5px;">${roll.result}</p>
            <p><button id="rollDamage">Obrażenia</button></p>
            `
          } else if (roll.total <= Umiejka2){
            chatContent = `
            <p><strong style="text-align:center;
            min-width: 75%;
            display: flex; 
            color: #1c4d3f;
            font-size: 21px;
            background-color: #d6d3c8;
            justify-content: center; 
            margin: 5px; 
            border: 1.5px solid #858581; 
            border-radius: 5px;">Sukces!</strong><strong style="text-align:center;
            min-width: 20%;
            display: flex; 
            color: #393930;
            font-size: 20px;
            background-color: #d6d3c8; 
            justify-content: center; 
            margin: 5px; 
            border: 1.5px solid #858581; 
            border-radius: 5px;">${roll.total}</strong></p>
            <p style="text-align:center;
            color: #393930;
            font-size: 12px;
            vertical-align: middle;
            background-color: #d6d3c8;
            display: flex; 
            justify-content: center; 
            margin: 5px; 
            border: 1.5px solid #858581; 
            border-radius: 5px;">${roll.result}</p>
            <p><button id="rollDamage">Obrażenia</button></p>
            `
          } else if (roll.total >= Math.floor(100-((100-sztukiWalki)/20)) && sztukiWalki > 0){
            chatContent = `
            <p><strong style="text-align:center;
            min-width: 75%;
            display: flex; 
            color: #080808;
            font-size: 21px;
            background-color: #d6d3c8;
            justify-content: center; 
            margin: 5px; 
            border: 1.5px solid #858581; 
            border-radius: 5px;">Krytyczna porażka!*</strong><strong style="text-align:center;
            min-width: 20%;
            display: flex; 
            color: #393930;
            font-size: 20px;
            background-color: #d6d3c8; 
            justify-content: center; 
            margin: 5px; 
            border: 1.5px solid #858581; 
            border-radius: 5px;">${roll.total}</strong></p>
            <p style="text-align:center;
            color: #393930;
            font-size: 12px;
            vertical-align: middle;
            background-color: #d6d3c8;
            display: flex; 
            justify-content: center; 
            margin: 5px; 
            border: 1.5px solid #858581; 
            border-radius: 5px;">${roll.result}</p>
            <p style="text-align:center;
            vertical-align: middle;
            display: flex; 
            justify-content: center; 
            margin: 5px;"
            >${tabelaKryt}</p>
            `
          } else if (roll.total >= Math.floor(100-((100-Umiejka2)/20))){
            chatContent = `
            <p><strong style="text-align:center;
            min-width: 75%;
            display: flex; 
            color: #080808;
            font-size: 21px;
            background-color: #d6d3c8;
            justify-content: center; 
            margin: 5px; 
            border: 1.5px solid #858581; 
            border-radius: 5px;">Krytyczna porażka!</strong><strong style="text-align:center;
            min-width: 20%;
            display: flex; 
            color: #393930;
            font-size: 20px;
            background-color: #d6d3c8; 
            justify-content: center; 
            margin: 5px; 
            border: 1.5px solid #858581; 
            border-radius: 5px;">${roll.total}</strong></p>
            <p style="text-align:center;
            color: #393930;
            font-size: 12px;
            vertical-align: middle;
            background-color: #d6d3c8;
            display: flex; 
            justify-content: center; 
            margin: 5px; 
            border: 1.5px solid #858581; 
            border-radius: 5px;">${roll.result}</p>
            <p style="text-align:center;
            vertical-align: middle;
            display: flex; 
            justify-content: center; 
            margin: 5px;"
            >${tabelaKryt}</p>
            `
          } else if (roll.total >= Umiejka2){
            chatContent = `
            <p><strong style="text-align:center;
            min-width: 75%;
            display: flex; 
            color: #660303;
            font-size: 21px;
            background-color: #d6d3c8;
            justify-content: center; 
            margin: 5px; 
            border: 1.5px solid #858581; 
            border-radius: 5px;">Porażka!</strong><strong style="text-align:center;
            min-width: 20%;
            display: flex; 
            color: #393930;
            font-size: 20px;
            background-color: #d6d3c8; 
            justify-content: center; 
            margin: 5px; 
            border: 1.5px solid #858581; 
            border-radius: 5px;">${roll.total}</strong></p>
            <p style="text-align:center;
            color: #393930;
            font-size: 12px;
            vertical-align: middle;
            background-color: #d6d3c8;
            display: flex; 
            justify-content: center; 
            margin: 5px; 
            border: 1.5px solid #858581; 
            border-radius: 5px;">${roll.result}</p>
            `
          }

            ChatMessage.create({
              speaker: {
                alias: currentActor.name
              },
              content: chatContent
            })

            Hooks.once('renderChatMessage', (chatItem, html) => {
              html.find("#rollDamage").click(async () => {
                const table1 = game.tables.find(t=>t.name==="Miejsce trafienia");
                const HitLocation = await table1.draw();

                let pancerz1 = {};
                if (HitLocation.results[0].text == "Prawa noga" || "Lewa noga"){
                  pancerz1 = currentTarget.system.attributes.pancerz_nogi?.value;
                } else if (HitLocation.results[0].text == "Brzuch" || "Klatka piersiowa"){
                  pancerz1 = currentTarget.system.attributes.pancerz_korpus?.value;
                } else if (HitLocation.results[0].text == "Prawa ręka" || "Lewa ręka"){
                  pancerz1 = currentTarget.system.attributes.pancerz_rece?.value;
                } else if (HitLocation.results[0].text == "Głowa"){
                  pancerz1 = currentTarget.system.attributes.pancerz_glowa?.value;
                }
                //console.log(pancerz1)

                let wepDmg = {};
                if (weapon.system.attributes.modyfikator.value == "caly" && roll.total <= sztukiWalki && sztukiWalki > 0 && roll.total > Math.floor(Umiejka2/20) && roll.total <= Math.floor(Umiejka2/5) && weapon.system.attributes.obr_specjalne.value == "przeszycie"){
                  wepDmg = `${weapon.system.attributes.obrazenia.value} + ${weapon.system.attributes.obrazenia.value} + ${weapon.system.attributes.obrazenia.value} + ${characterMod}`
                } else if (weapon.system.attributes.modyfikator.value == "pol" && roll.total <= sztukiWalki && sztukiWalki > 0 && roll.total > Math.floor(Umiejka2/20) && roll.total <= Math.floor(Umiejka2/5) && weapon.system.attributes.obr_specjalne.value == "przeszycie"){
                  wepDmg = `${weapon.system.attributes.obrazenia.value} + ${weapon.system.attributes.obrazenia.value} + ${weapon.system.attributes.obrazenia.value} + ${characterMod}/2`
                } else if (weapon.system.attributes.modyfikator.value == "brak" && roll.total <= sztukiWalki && sztukiWalki > 0 && roll.total > Math.floor(Umiejka2/20) && roll.total <= Math.floor(Umiejka2/5) && weapon.system.attributes.obr_specjalne.value == "przeszycie"){
                  wepDmg = `${weapon.system.attributes.obrazenia.value} + ${weapon.system.attributes.obrazenia.value} + ${weapon.system.attributes.obrazenia.value}`
                } else if (weapon.system.attributes.modyfikator.value == "caly" && ((roll.total <= sztukiWalki && sztukiWalki > 0) || (roll.total > Math.floor(Umiejka2/20) && roll.total <= Math.floor(Umiejka2/5) && weapon.system.attributes.obr_specjalne.value == "przeszycie"))){
                  wepDmg = `${weapon.system.attributes.obrazenia.value} + ${weapon.system.attributes.obrazenia.value} + ${characterMod}`
                } else if (weapon.system.attributes.modyfikator.value == "pol" && ((roll.total <= sztukiWalki && sztukiWalki > 0) || (roll.total > Math.floor(Umiejka2/20) && roll.total <= Math.floor(Umiejka2/5) && weapon.system.attributes.obr_specjalne.value == "przeszycie"))){
                  wepDmg = `${weapon.system.attributes.obrazenia.value} + ${weapon.system.attributes.obrazenia.value} + ${characterMod}/2`
                } else if (weapon.system.attributes.modyfikator.value == "brak" && ((roll.total <= sztukiWalki && sztukiWalki > 0) || (roll.total > Math.floor(Umiejka2/20) && roll.total <= Math.floor(Umiejka2/5) && weapon.system.attributes.obr_specjalne.value == "przeszycie"))){
                  wepDmg = `${weapon.system.attributes.obrazenia.value} + ${weapon.system.attributes.obrazenia.value}`
                } else if (weapon.system.attributes.modyfikator.value == "caly"){
                  wepDmg = `${weapon.system.attributes.obrazenia.value} + ${characterMod}`
                } else if (weapon.system.attributes.modyfikator.value == "pol"){
                  wepDmg = `${weapon.system.attributes.obrazenia.value} + ${characterMod}/2`
                } else if (weapon.system.attributes.modyfikator.value == "brak"){
                  wepDmg = `${weapon.system.attributes.obrazenia.value}`
                } else {};
                
                let wepDmgMax = {};
                if (weapon.system.attributes.modyfikator.value == "caly" && roll.total <= sztukiWalki && sztukiWalki > 0){
                  wepDmgMax = `${weapon.system.attributes.obrazenia_max.value} + ${weapon.system.attributes.obrazenia_max.value} + ${characterMod}`
                } else if (weapon.system.attributes.modyfikator.value == "pol" && roll.total <= sztukiWalki && sztukiWalki > 0){
                  wepDmgMax = `${weapon.system.attributes.obrazenia_max.value} + ${weapon.system.attributes.obrazenia_max.value} + ${characterMod}/2`
                } else if (weapon.system.attributes.modyfikator.value == "brak" && roll.total <= sztukiWalki && sztukiWalki > 0){
                  wepDmgMax = `${weapon.system.attributes.obrazenia_max.value} + ${weapon.system.attributes.obrazenia_max.value}`
                } else if (weapon.system.attributes.modyfikator.value == "caly"){
                  wepDmgMax = `${weapon.system.attributes.obrazenia_max.value} + ${characterMod}`
                } else if (weapon.system.attributes.modyfikator.value == "pol"){
                  wepDmgMax = `${weapon.system.attributes.obrazenia_max.value} + ${characterMod}/2`
                } else if (weapon.system.attributes.modyfikator.value == "brak"){
                  wepDmgMax = `${weapon.system.attributes.obrazenia_max.value}`
                }

                if(roll.total > Math.floor(Umiejka2/20) && roll.total <= Math.floor(Umiejka2/5) && weapon.system.attributes.obr_specjalne.value == "przeszycie"){
                  ChatMessage.create({
                    content: `Obrażenia od broni zostają podwojone. Broń pozostaje w ciele celu, chyba, że atakujący pozytywnie zda bardzo trudny test użycia broni. 
                    W innym wypadku musi poświęcić kolejną rundę w całości na wydostanie broni i przez ten czas będzie łatwym celem. 
                    Jeśli cel chce wyjąć broń, musi zdać test oporu SIŁ vs zadane przez broń obrażenia i zajmie mu to całą rundę`
                })
                } else if (roll.total > Math.floor(Umiejka2/20) && roll.total <= Math.floor(Umiejka2/5) && weapon.system.attributes.obr_specjalne.value == "miazdzenie"){
                  ChatMessage.create({
                    content: `Bonus do obrażeń zostaje zwiększony o jeden poziom (np. z 1K6 do 2K6 itd.), a jeśli cel nie zda testu na wytrzymałość zostaje ogłuszony na 1K3 rund.`
                })
                } else if (roll.total > Math.floor(Umiejka2/20) && roll.total <= Math.floor(Umiejka2/5) && weapon.system.attributes.obr_specjalne.value == "krwawienie"){
                  ChatMessage.create({
                    content: `Cel odejmuje 1 PŻ w każdej kolejnej rundzie do czasu zatamowania krwawienia (za pomocą pierwszej pomocy lub tymczasowo przy pomocy uciskania rany) lub śmierci.`
                })
                } else if (roll.total > Math.floor(Umiejka2/20) && roll.total <= Math.floor(Umiejka2/5) && weapon.system.attributes.obr_specjalne.value == "duszenie"){
                  ChatMessage.create({
                    content: `Od momentu kiedy postać traci dostęp do tlenu co rundę rzuca na Kondycję. W pierwszej rundzie będzie to KON x 10, w drugiej KON x 9, w trzeciej KON x 8 itd. Od dziesiątej rundy postać rzuca za każdym razem na KON x 1. Jeśli rzut się nie uda, postać otrzymuje obrażenia odpowiednie do sposobu duszenia.`
                })
                } else if (roll.total > Math.floor(Umiejka2/20) && roll.total <= Math.floor(Umiejka2/5) && weapon.system.attributes.obr_specjalne.value == "spetanie"){
                  ChatMessage.create({
                    content: `Cel zostaje zupełnie unieruchomiony na 2 rundy, po tym czasie może spróbować wyzwolić się za pomocą rzutu na zwinność lub rzutu z tabeli oporu SIŁ vs SIŁ.`
                })
                } else if (roll.total > Math.floor(Umiejka2/20) && roll.total <= Math.floor(Umiejka2/5) && weapon.system.attributes.obr_specjalne.value == "odrzut"){
                  ChatMessage.create({
                    content: `Cel rzuca z tabeli oporu BC vs całkowite obrażenia od broni. Jeśli nie zda testu zostaje odrzucony o 1m na każde 5 punktów obrażeń. Jeśli uderzy w przeszkodę, doznaje obrażeń 1K6 za każde przebyte 3m. Następnie cel rzuca na zwinność, jeśli nie zda to upada.`
                })
                }

                let messageDamage = {};
                if(roll.total <= Math.floor(Umiejka2/20)){
                  messageDamage = await new Roll(wepDmgMax).toMessage({
                  speaker: {
                    alias: currentActor.name
                  }});
                } else {messageDamage = await new Roll(wepDmg).toMessage({
                  speaker: {
                    alias: currentActor.name
                  }});
                }

                const poprzednieHP = currentTarget.system.health.value;
                const totalDamage = messageDamage.rolls[0].total;
                const maxHP = currentTarget.system.health.max;
                let newHealth = {};
                if(roll.total <= Math.floor(Umiejka2/20)){newHealth = currentTarget.system.health.value - totalDamage
                } else {newHealth = currentTarget.system.health.value - totalDamage + pancerz1
                };

                if(newHealth > currentTarget.system.health.value){
                  newHealth = currentTarget.system.health.value
                };
              })
            });
        }
      },
    }
  }).render(true);
}