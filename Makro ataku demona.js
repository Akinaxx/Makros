 main()

async function main(){
  let selected = canvas.tokens.controlled;
  if(selected.length == 0 || selected.length > 1){
    ui.notifications.error("Wybierz jednego bohatera");
  }

  let targets = Array.from(game.user.targets);
  if(targets.length == 0 || selected.length > 1){
    ui.notifications.error("Wybierz dokładnie jeden cel");
  }

  let currentActor = selected[0].actor;
  let currentTarget = targets[0].actor;
  //console.log(currentActor);
  //console.log(currentTarget);

  if(currentActor === currentTarget){
    ui.notifications.error("Bohater nie może być swoim własnym celem");
    return
  }
  
  let actorWeapons = currentActor.items.filter(item => item.system.attributes.typ?.value == "broń")
  console.log(actorWeapons);

  let options = ""
  for(let wep of actorWeapons){
    options += `<option value=${wep.id}>${wep.name} | ${wep.system.attributes.poziom.value}%</option>`
  }

  let dialogTemplate = `
  <div style="display:flex; flex-direction: column;  line-height: 1">
    <div class="header-container">
      <h3 style="display: inline-block; text-align: center; width: 95%;">Broń</h3>
    </div>
    <div>
    <span style="display: inline-block; text-align: center; vertical-align: middle; width: 95%;">
      <select id="weapon" style="width: 90%; text-align: center;">${options}</select>
    </span>
    </div>  
    <hr>
    <h3 style="flex:1; text-align:center;line-height: 1.5">Modyfikator rzutu</h3>
    <span style="flex:1; line-height: 2; text-align:center; "><input  id="modifier" type="number" value=0 style="width:50px; height:25px" /></span>
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

          let rollString = `d100 + ${modifier}`
          let roll = await new Roll(rollString).evaluate({async: true});
          console.log(roll.result);
          console.log(roll);

          let characterMod = currentActor.system.attributes.po_modyfikator_obrazen.value;

          let Umiejka2 = weapon.system.attributes.poziom.value;

          let tabelaKryt = `@UUID[RollTable.wXwsMXWYNYW8OHwI]{Krytyczna porażka broni naturalnej}`

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
                console.log(pancerz1)

                let wepDmg = {};
                if (weapon.system.attributes.modyfikator.value == "caly" && (roll.total > Math.floor(Umiejka2/20) && roll.total <= Math.floor(Umiejka2/5) && weapon.system.attributes.obr_specjalne.value == "przeszycie")){
                  wepDmg = `${weapon.system.attributes.obrazenia.value} + ${weapon.system.attributes.obrazenia.value} + ${characterMod}`
                } else if (weapon.system.attributes.modyfikator.value == "pol" && (roll.total > Math.floor(Umiejka2/20) && roll.total <= Math.floor(Umiejka2/5) && weapon.system.attributes.obr_specjalne.value == "przeszycie")){
                  wepDmg = `${weapon.system.attributes.obrazenia.value} + ${weapon.system.attributes.obrazenia.value} + ${characterMod}/2`
                } else if (weapon.system.attributes.modyfikator.value == "brak" && (roll.total > Math.floor(Umiejka2/20) && roll.total <= Math.floor(Umiejka2/5) && weapon.system.attributes.obr_specjalne.value == "przeszycie")){
                  wepDmg = `${weapon.system.attributes.obrazenia.value} + ${weapon.system.attributes.obrazenia.value}`
                } else if (weapon.system.attributes.modyfikator.value == "caly"){
                  wepDmg = `${weapon.system.attributes.obrazenia.value} + ${characterMod}`
                } else if (weapon.system.attributes.modyfikator.value == "pol"){
                  wepDmg = `${weapon.system.attributes.obrazenia.value} + ${characterMod}/2`
                } else if (weapon.system.attributes.modyfikator.value == "brak"){
                  wepDmg = `${weapon.system.attributes.obrazenia.value}`
                } else {};
                
                let wepDmgMax = {};
                if (weapon.system.attributes.modyfikator.value == "caly"){
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
                
                await currentTarget.update({"system.health.value": newHealth});
                await ui.notifications.info(`${currentTarget.name} otrzymał/a ${poprzednieHP - newHealth} obrażeń`)

                if(newHealth <= currentTarget.system.health.min){
                  ChatMessage.create({
                    content: `${currentTarget.name} otrzymał/a śmiertelne obrażenia`
                })
                };

                if ((poprzednieHP - newHealth) > Math.floor(maxHP / 2)){ 
                  await ChatMessage.create({
                    content:`${currentTarget.name} otrzymał/a poważną ranę i zemdleje po tylu turach, ile HP mu/jej pozostało. Rzuć na szczęście ([[/r d20]] z mocy) by sprawdzić czy uraz będzie trwały, a następnie rzuć z tabeli (lub wybierz uraz odpowiadający miejscu trafienia): @UUID[RollTable.yc8eb03DhAtG9uFq]{Efekt poważnej rany}`
                })
                } else if (newHealth < (maxHP / 2)){ 
                  await ChatMessage.create({
                    content:`${currentTarget.name} stracił/a ponad połowę HP, rzuć [[/r d100]] z progiem MOC x 4, jeśli nie zda, postać straci przytomność`
                })
                };
              })
            });
        }
      },
      close: {
        label: "Zamknij"
      }
    }
  }).render(true);
}