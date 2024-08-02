const { response, request } = require('express');
const qrcode = require('qrcode');
const { vCard } = require('vcard-generator');
const { createCanvas, loadImage } = require('canvas');


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


const QrEnlaceDescargableCalbosProductosA = async (req = request, res = response) => {
    try {
        // URL a la que se dirigirá el código QR
        const enlace = "http://localhost:3000/informacion-calbo";

        // Generar el código QR usando la URL
        qrcode.toDataURL(enlace, (err, qrCodeUrl) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            // Enviar respuesta JSON con el código QR
            res.json({ qrCodeUrl });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const QrEnlaceDescargableCalbosProductosF = async (req, res) => {
    try {
        const enlace = "http://generator-code-qr.casagri-group.com/";

        // Generar el código QR usando la URL
        const qrCodeData = await qrcode.toDataURL(enlace);

        // Crear un lienzo (canvas) para manipular la imagen
        const canvas = createCanvas(200, 200);
        const ctx = canvas.getContext('2d');

        // Cargar la imagen del código QR en el lienzo
        const qrImage = await loadImage(qrCodeData);
        ctx.drawImage(qrImage, 0, 0);

        // Cargar el logotipo
        const logo = await loadImage('images/casagri-logo-01.svg'); // Ruta al logotipo
        // Superponer el logotipo en el centro del código QR
        const logoSize = 50; // Tamaño del logotipo
        const qrSize = 150; // Tamaño del código QR
        const x = (qrSize - logoSize) / 2;
        const y = (qrSize - logoSize) / 2;
        ctx.drawImage(logo, x, y, logoSize, logoSize);

        // Convertir el lienzo a una imagen base64
        const decoratedQrCodeUrl = canvas.toDataURL('image/png');

        // Enviar respuesta JSON con la imagen decorada del código QR
        res.json({ qrCodeUrl: decoratedQrCodeUrl });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};


const QrEnlaceDescargableCalbosProductos = async (req = request, res = response) => {
    try {
        // URL a la que se dirigirá el código QR
        const enlace = "https://www.casagri-group.com/informacion-calbo";

        // Generar el código QR usando la URL
        const qrCodeUrl = await qrcode.toDataURL(enlace);

        // Enviar respuesta JSON con el código QR
        res.json({ qrCodeUrl });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};


const QrLinkTreCasagri = async (req = request, res = response) => {
    try {
        // URL a la que se dirigirá el código QR
        const enlace = "https://linktr.ee/casagri.ve";

        // Generar el código QR usando la URL
        const qrCodeUrl = await qrcode.toDataURL(enlace);

        // Enviar respuesta JSON con el código QR
        res.json({ qrCodeUrl });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};


module.exports = {
    QrGeneratorDore,
    QrEnlaceDescargableCalbosProductos,
    QrLinkTreCasagri
}