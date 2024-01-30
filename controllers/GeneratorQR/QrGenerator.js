const { response, request } = require('express');
const qrcode = require('qrcode');
const { vCard } = require('vcard-generator');



//-------------------- GENERAR QR ---------------------------//

const QrGeneratorDoreTwo = async (req = request, res = response) => {

    try {
        const { nombre, apellido, email, telefono, password } = req.body;

        if(password != 123 ){
            return res.status(401).json({ error: 'Unauthorized' });
        }else{
            // Convertir la información de contacto a formato vCard
            const vcardStringtwo = `BEGIN:VCARD
            BEGIN:VCARD
    VERSION:4.0
    N:Torrealba;Luis
    FN:Luis Torrealba
    EMAIL;PREF=1;TYPE=work:Luisdavid25@gmail.com
    TEL;VALUE=uri;PREF=3:tel:04245809383
    END:VCARD`;

            // Generar el código QR usando la información de contacto
            /*qrcode.toBuffer(vcardStringtwo, async (err, qrCodeBuffer) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }

                // Crear un objeto JSON con la imagen del código QR
                const qrCodeJson = { qrCodeImage: qrCodeBuffer.toString('base64') };*/
                


            qrcode.toDataURL(vcardStringtwo, (err, qrCodeUrl) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
                //res.send(qrCodeUrl);
                res.send(`
                <!DOCTYPE html>
                <html>
                    <head>
                        <meta charset="utf-8">
                        <title>PAGINA</title>
                    </head>
                    <body>
                        <h1>Escanea este código QR para guardar el contacto</h1>
                        <img src="${qrCodeUrl}" alt="QR Code">
                    </body>
                </html>
            `);
        });
            
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const QrGeneratorDore = async (req = request, res = response) => {
    try {

        const { nombre, apellido, email, titulo, telefono, password } = req.body;

        if(password !== "Doredorito" ){
            return res.status(401).json({ error: 'Autorización no válida' });
        }else{

                    // Convertir la información de contacto a formato vCard
        const vcardString = `BEGIN:VCARD
        BEGIN:VCARD
VERSION:4.0
N:${apellido};${nombre}
FN:${nombre} ${apellido}
EMAIL;PREF=1;TYPE=work:${email}
TITLE:${titulo}
TEL;VALUE=uri;PREF=3:tel:${telefono}
END:VCARD`;


        // Generar el código QR usando la información de contacto
        qrcode.toDataURL(vcardString, (err, qrCodeUrl) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            // Enviar respuesta HTML con el código QR
            res.json(qrCodeUrl);
        });

        }

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    QrGeneratorDore
}