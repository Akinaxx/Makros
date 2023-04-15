 main()

async function main(){
  let dialogTemplate = `
  <table style="border-width: 0">
    <tr>
      <td style="width: 20%"></td>
      <td><span style="flex:1; text-align:center; vertical-align: middle; display: flex; justify-content: center; width: 5%"><input  id="OsAktywna" type="radio" name="drone" checked/></span></td>
      <td style="text-align:center; width: 40%">Poziom cechy aktywnej:</td> 
      <td style="text-align:center; width: 15%"><span style="line-height: 2; text-align:center; vertical-align: middle; display: flex; justify-content: center"><input  id="CechaAktywna" type="number" value=0 style="width:40px; height:25px" /></span></td>
      <td style="width: 20%"></td>
      </tr>
    <tr>
      <td style="width: 20%"></td>
      <td><span style="flex:1; text-align:center; vertical-align: middle; display: flex; justify-content: center; width: 5%"><input  id="OsPasywna" type="radio" name="drone"/></span></td>
      <td style="text-align:center; width: 40%">Poziom cechy pasywnej:</td> 
      <td style="text-align:center; width: 15%"><span style="line-height: 2; text-align:center; vertical-align: middle; display: flex; justify-content: center"><input  id="CechaPasywna" type="number" value=0 style="width:40px; height:25px" /></span></td>
      <td style="width: 20%"></td>
      </tr>
  </table>
  `

  new Dialog({
    title: "Tabela oporu",
    content: dialogTemplate,
    buttons: {
      DajOpcjeRzutu: {
        label: "Wyświetl opcje rzutu",
        callback: async (html) => {
          let CechaAktywna = html.find("#CechaAktywna")[0].value;
          let CechaPasywna = html.find("#CechaPasywna")[0].value;
          let OsAktywna = html.find("#OsAktywna")[0].checked;
          let OsPasywna = html.find("#OsPasywna")[0].checked;

          let PoziomTrudnosci = {};
          if(html.find("#OsAktywna")[0].checked){
            PoziomTrudnosci = (50+(CechaAktywna*5)-(CechaPasywna*5));
          } else {PoziomTrudnosci = (50+(CechaPasywna*5)-(CechaAktywna*5));
          }

          let chatContent = ""
          if(PoziomTrudnosci >= 100){
            chatContent = `
            <p><strong style="text-align:center;
              color: #006b20;
              font-size: 18px;
              vertical-align: middle;
              background-color: #d6d3c8;
              display: flex; 
              justify-content: center; 
              margin: 5px; 
              border: 1.5px solid #858581; 
              border-radius: 5px;">Automatyczny sukces!</strong></p>
            `
          } else if (PoziomTrudnosci <= 0){
            chatContent = `
            <p><strong style="text-align:center;
              color: #6b0000;
              font-size: 18px;
              vertical-align: middle;
              background-color: #d6d3c8;
              display: flex; 
              justify-content: center; 
              margin: 5px; 
              border: 1.5px solid #858581; 
              border-radius: 5px;">Automatyczna porażka!</strong></p>
            `
          } else {
            chatContent = `
            <p style="text-align:left;
              color: #1f1b1b;
              font-size: 16px;
              vertical-align: middle;
              display: flex; 
              justify-content: left; 
              margin: 2px; ">Poziom trudności:&nbsp;&nbsp; ${PoziomTrudnosci} </p>
              <p><button id="RzutZTabeli">Rzuć K100</button></p>
            `
          };

          ChatMessage.create({
            speaker: {
              alias: "Tabela oporu"
            },
            content: chatContent
          })

          let rzut = `d100`

          Hooks.once('renderChatMessage', (chatItem, html) => {
            html.find("#RzutZTabeli").click(async () => {
              const messageRzut = await new Roll(rzut).toMessage();

              let sukces1 = `
              <p><strong style="text-align:center;
                color: #006b20;
                font-size: 18px;
                vertical-align: middle;
                background-color: #d6d3c8;
                display: flex; 
                justify-content: center; 
                margin: 5px; 
                border: 1.5px solid #858581; 
                border-radius: 5px;">Sukces!</strong></p>
              `

              let porazka1 = `
              <p><strong style="text-align:center;
                color: #6b0000;
                font-size: 18px;
                vertical-align: middle;
                background-color: #d6d3c8;
                display: flex; 
                justify-content: center; 
                margin: 5px; 
                border: 1.5px solid #858581; 
                border-radius: 5px;">Porażka!</strong></p>
              `

              if ((messageRzut.rolls[0].total) <= PoziomTrudnosci){ 
                await ChatMessage.create({
                  content: sukces1
              })
              } else { 
                await ChatMessage.create({
                  content: porazka1
              })
              };

            })})

        }
      }
    }
  }).render(true);
}