 main()

async function main(){
  let selected = canvas.tokens.controlled;
  if(selected.length == 0 || selected.length > 1){
    ui.notifications.error("Wybierz jednego bohatera");
  }

  let currentTarget = selected[0].actor;

  const options = `
  <option value="nogi">Nogi</option>
  <option value="rece">Ręce</option>
  <option value="korpus">Korpus</option>
  <option value="glowa">Głowa</option>
  `;


  let dialogTemplate = `
  <table style="border-width: 0">
    <tr>
      <td style="text-align:center; width: 30%">Obrażenia</td> 
      <td style="text-align:center; width: 20%">Krytyczne</td> 
      <td style="text-align:center; width: 50%">Miejsce</td>
    </tr>
    <tr>
      <td><span style="line-height: 2; text-align:center; vertical-align: middle; display: flex; justify-content: center"><input  id="zadaneObr" type="number" value=0 style="width:40px; height:25px" /></span></td>
      <td><span style="text-align:center; vertical-align: middle; display: flex; justify-content: center"><input  id="krytyk" type="checkbox" unchecked/></span></td>
      <td><span style="text-align:center; vertical-align: middle; display: flex; justify-content: center"><select id="hitLoc" style="flex:1; text-align:center; vertical-align: middle; display: flex; justify-content: center">${options}</select></span></td>
    </tr>
  </table>
  `

  new Dialog({
    title: "Obrażenia",
    content: dialogTemplate,
    buttons: {
      RzucObrazenia: {
        label: "Rzuć na atak",
        callback: async (html) => {
          let zadaneObr = html.find("#zadaneObr")[0].value;
          let krytyk = html.find("#krytyk")[0].checked;
          let hitLoc = html.find("#hitLoc")[0].value;

          let pancerz1 = {};
          if (hitLoc == "nogi"){
            pancerz1 = currentTarget.system.attributes.pancerz_nogi?.value;
          } else if (hitLoc == "korpus"){
            pancerz1 = currentTarget.system.attributes.pancerz_korpus?.value;
          } else if (hitLoc == "rece"){
            pancerz1 = currentTarget.system.attributes.pancerz_rece?.value;
          } else if (hitLoc == "glowa"){
            pancerz1 = currentTarget.system.attributes.pancerz_glowa?.value;
          }

          const poprzednieHP = currentTarget.system.health.value;
          const totalDamage = zadaneObr;
          const maxHP = currentTarget.system.health.max;
          let newHealth = {};
          if(html.find("#krytyk")[0].checked){newHealth = currentTarget.system.health.value - totalDamage
          } else {newHealth = currentTarget.system.health.value - totalDamage + pancerz1
          };

          if(newHealth > currentTarget.system.health.value){
            newHealth = currentTarget.system.health.value
          };
          
          await currentTarget.update({"system.health.value": newHealth});
          await ui.notifications.info(`${currentTarget.name} otrzymał/a ${poprzednieHP - newHealth} obrażeń`)

          if (newHealth < 1){ 
            await ChatMessage.create({
              content:`${currentTarget.name} pada na ziemię nieprzytomny/a, jeśli w tej lub kolejnej turze nie otrzyma leczenia podwyższającego jego/jej PŻ do 1, umrze.`
          })
          } else if ((poprzednieHP - newHealth) > Math.floor(maxHP / 2)){
            await ChatMessage.create({
              content:`${currentTarget.name} otrzymał/a poważną ranę i zemdleje po tylu turach, ile HP mu/jej pozostało. Rzuć na szczęście ([[/r d20]] z mocy) by sprawdzić czy uraz będzie trwały, a następnie rzuć z tabeli (lub wybierz uraz odpowiadający miejscu trafienia): @UUID[RollTable.yc8eb03DhAtG9uFq]{Efekt poważnej rany}`
          })
          } else if (newHealth < (maxHP / 2)){ 
            await ChatMessage.create({
              content:`${currentTarget.name} stracił/a ponad połowę HP, rzuć [[/r d100]] z progiem MOC x 4, jeśli nie zda, postać straci przytomność`
          })
          };
        }
      },
    }
  }).render(true);
}