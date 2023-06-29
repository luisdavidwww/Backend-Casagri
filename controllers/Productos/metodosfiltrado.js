const { response } = require('express');
const ProductoMSchema = require('../../models/Productos/productoM');


//------------------------------------- FILTRAR CATEGORIAS DE PRODUCTOS -----------------------------------------/


//------------------------------------- Agroindustrial -----------------------------------------//

const otrosAgroquimicos =  async(req, res) => {

    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 16;

    //Condiciones para el filtro
    const query = {
      $or: [
        { Cat3: "FITORREGULADORES" },
        { Cat3: "REGULADORES DE pH" },
        { Cat3: "ADHERENTES-HUMECTANTES" }
      ]
    };


    // Calcula el índice de inicio y la cantidad de elementos a mostrar
    const startIndex = (pageNumber - 1) * limitNumber;

    const [ total, productos ] = await Promise.all([
      ProductoMSchema.find(query).countDocuments(),
      ProductoMSchema.find(query)
                      .skip(startIndex)
                      .limit(limitNumber)
    ]);


    // Obtén todas las marcas únicas de los productos
    const marcas = await ProductoMSchema.distinct('Marca', query);
    // Crea un arreglo de objetos para las marcas en el formato requerido
    const marcasArray = marcas.map((marca) => ({ Marca: marca }));

    // Obtén todos los componentes únicos 
    const componentes = await ProductoMSchema.distinct('cat4', query);
    // Crea un arreglo de objetos para las marcas en el formato requerido
    const componentesArray = componentes.map((component) => ({ cat4: component }));

    // Calcula el número total de páginas
    const totalPages = Math.ceil(total / limitNumber);

    // Construye el objeto de respuesta con los datos paginados y los metadatos
    const response = {
      total,
      totalPages,
      currentPage: pageNumber,
      productos,
      marcas: marcasArray,
      componentes: componentesArray
    };

    res.status(200).json(response);

};


const cercasAlambreyElectricas =  async(req, res) => {

    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 16;

    //Condiciones para el filtro
    const query = {
      $or: [
        { cat2: "CERCAS" },
        { cat2: "MALLAS Y PLÁSTICOS DE USOS VAR" },
      ]
    };


    // Calcula el índice de inicio y la cantidad de elementos a mostrar
    const startIndex = (pageNumber - 1) * limitNumber;

    const [ total, productos ] = await Promise.all([
      ProductoMSchema.find(query).countDocuments(),
      ProductoMSchema.find(query)
                      .sort({ Nombre: 1 }) // Ordena alfabéticamente por el campo "Nombre"
                      .skip(startIndex)
                      .limit(limitNumber)
    ]);


    // Obtén todas las marcas únicas de los productos
    const marcas = await ProductoMSchema.distinct('Marca', query);
    // Crea un arreglo de objetos para las marcas en el formato requerido
    const marcasArray = marcas.map((marca) => ({ Marca: marca }));


    // Calcula el número total de páginas
    const totalPages = Math.ceil(total / limitNumber);

    // Construye el objeto de respuesta con los datos paginados y los metadatos
    const response = {
      total,
      totalPages,
      currentPage: pageNumber,
      productos,
      marcas: marcasArray
    };

    res.status(200).json(response);

};
  

const maquinarias =  async(req, res) => {

    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 16;

    //Condiciones para el filtro
    const query = {
      $or: [
        { Cat3: "MOTOCULTORES" },
        { cat2: "MAQUINAS PARA LA SIEMBRA" },
        { cat2: "MAQUINARIA PARA LA RECOLECCION" },
        { cat2: "MAQUINAS PARA EL ABONO Y FERTI" },
        { cat2: "MAQUINARIA PROCESAMIENTO MATER" },
        { cat2: "EQUIPOS DE FUMIGACIÓN" },
      ],
    };


    // Calcula el índice de inicio y la cantidad de elementos a mostrar
    const startIndex = (pageNumber - 1) * limitNumber;

    const [ total, productos ] = await Promise.all([
      ProductoMSchema.find(query).countDocuments(),
      ProductoMSchema.find(query)
                      .skip(startIndex)
                      .limit(limitNumber)
    ]);

    // Obtén todas las marcas únicas de los productos
    const marcas = await ProductoMSchema.distinct('Marca', query);
    // Crea un arreglo de objetos para las marcas en el formato requerido
    const marcasArray = marcas.map((marca) => ({ Marca: marca }));

    // Calcula el número total de páginas
    const totalPages = Math.ceil(total / limitNumber);

    // Construye el objeto de respuesta con los datos paginados y los metadatos
    const response = {
      total,
      totalPages,
      currentPage: pageNumber,
      productos,
      marcas: marcasArray
    };

    res.status(200).json(response);

};
  

const maquinariasTotal =  async(req, res) => {

  const { page, limit } = req.query;
  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 16;

  //Condiciones para el filtro
  const query = {
    $or: [
      { cat1: "MAQUINARIA E IMPLEMENTOS" },
      { Cat3: "ASPERJADORAS" },
    ]
  };


  // Calcula el índice de inicio y la cantidad de elementos a mostrar
  const startIndex = (pageNumber - 1) * limitNumber;

  const [ total, productos ] = await Promise.all([
    ProductoMSchema.find(query).countDocuments(),
    ProductoMSchema.find(query)
                    .skip(startIndex)
                    .limit(limitNumber)
  ]);


  // Obtén todas las marcas únicas de los productos
  const marcas = await ProductoMSchema.distinct('Marca', query);
  // Crea un arreglo de objetos para las marcas en el formato requerido
  const marcasArray = marcas.map((marca) => ({ Marca: marca }));

  // Calcula el número total de páginas
  const totalPages = Math.ceil(total / limitNumber);

  // Construye el objeto de respuesta con los datos paginados y los metadatos
  const response = {
    total,
    totalPages,
    currentPage: pageNumber,
    productos,
    marcas: marcasArray
  };

  res.status(200).json(response);

};


const bambasDeAgua =  async(req, res) => {

    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 16;

    //Condiciones para el filtro
    const query = {
      $or: [
        { Cat3: "BOMBAS DE AGUA USO DOMESTICO" },
        { Cat3: "BOMBAS DE AGUA PORTATILES" }
      ]
    };

    // Calcula el índice de inicio y la cantidad de elementos a mostrar
    const startIndex = (pageNumber - 1) * limitNumber;

    const [ total, productos ] = await Promise.all([
      ProductoMSchema.find(query).countDocuments(),
      ProductoMSchema.find(query)
                      .skip(startIndex)
                      .limit(limitNumber)
    ]);

    // Obtén todas las marcas únicas de los productos
    const marcas = await ProductoMSchema.distinct('Marca', query);
    // Crea un arreglo de objetos para las marcas en el formato requerido
    const marcasArray = marcas.map((marca) => ({ Marca: marca }));

    // Calcula el número total de páginas
    const totalPages = Math.ceil(total / limitNumber);

    // Construye el objeto de respuesta con los datos paginados y los metadatos
    const response = {
      total,
      totalPages,
      currentPage: pageNumber,
      productos,
      marcas: marcasArray
    };

    res.status(200).json(response);

};



//------------------------------------- Semillas -----------------------------------------//


const semillas =  async(req, res) => {

    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 16;

    //Condiciones para el filtro
    const query = {
      cat2: "SEMILLAS",
        $or: [
            { cat4: { $nin: ["BOLSAS", "BANDEJAS"] } }
          ]
      };


    // Calcula el índice de inicio y la cantidad de elementos a mostrar
    const startIndex = (pageNumber - 1) * limitNumber;

    const [ total, productos ] = await Promise.all([
      ProductoMSchema.find(query).countDocuments(),
      ProductoMSchema.find(query)
                      .skip(startIndex)
                      .limit(limitNumber)
    ]);

    // Obtén todas las marcas únicas de los productos
    const marcas = await ProductoMSchema.distinct('Marca', query);
    // Crea un arreglo de objetos para las marcas en el formato requerido
    const marcasArray = marcas.map((marca) => ({ Marca: marca }));

    // Calcula el número total de páginas
    const totalPages = Math.ceil(total / limitNumber);

    // Construye el objeto de respuesta con los datos paginados y los metadatos
    const response = {
      total,
      totalPages,
      currentPage: pageNumber,
      productos,
      marcas: marcasArray
    };

    res.status(200).json(response);

};

const maizHibrido =  async(req, res) => {

    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 16;

    //Condiciones para el filtro
    const query = {
      $or: [
        { cat4: "MAIZ AMARILLO" },
        { cat4: "MAIZ BLANCO" },
      ]
    };


    // Calcula el índice de inicio y la cantidad de elementos a mostrar
    const startIndex = (pageNumber - 1) * limitNumber;

    const [ total, productos ] = await Promise.all([
      ProductoMSchema.find(query).countDocuments(),
      ProductoMSchema.find(query)
                      .skip(startIndex)
                      .limit(limitNumber)
    ]);

    // Obtén todas las marcas únicas de los productos
    const marcas = await ProductoMSchema.distinct('Marca', query);
    // Crea un arreglo de objetos para las marcas en el formato requerido
    const marcasArray = marcas.map((marca) => ({ Marca: marca }));

    // Calcula el número total de páginas
    const totalPages = Math.ceil(total / limitNumber);

    // Construye el objeto de respuesta con los datos paginados y los metadatos
    const response = {
      total,
      totalPages,
      currentPage: pageNumber,
      productos,
      marcas: marcasArray
    };

    res.status(200).json(response);

};

const hortalizas =  async(req, res) => {

  const { page, limit } = req.query;
  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 16;

  //Condiciones para el filtro
  const query = {
    $or: [
      { Cat3: "HORTALIZAS VARIEDADES" },
      { Cat3: "HORTALIZAS HIBRIDOS" },
    ]
  };

  // Calcula el índice de inicio y la cantidad de elementos a mostrar
  const startIndex = (pageNumber - 1) * limitNumber;

  const [ total, productos ] = await Promise.all([
    ProductoMSchema.find(query).countDocuments(),
    ProductoMSchema.find(query)
                    .skip(startIndex)
                    .limit(limitNumber)
  ]);

  // Obtén todas las marcas únicas de los productos
  const marcas = await ProductoMSchema.distinct('Marca', query);
  // Crea un arreglo de objetos para las marcas en el formato requerido
  const marcasArray = marcas.map((marca) => ({ Marca: marca }));

  // Calcula el número total de páginas
  const totalPages = Math.ceil(total / limitNumber);

  // Construye el objeto de respuesta con los datos paginados y los metadatos
  const response = {
    total,
    totalPages,
    currentPage: pageNumber,
    productos,
    marcas: marcasArray
  };

  res.status(200).json(response);

};

  

//------------------------------------- Medicina Veternaria -----------------------------------------//

//ANALGÉSICOS Y ANTIINFLAMATORIOS
const analgesicosAntiinflamatorios =  async(req, res) => {

    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 16;

    //Condiciones para el filtro
    const query = {
      $or: [
        {Cat3: "ANALGESICO Y ANTIINFLAMATORIO" },
        {Cat3: "ANTIDOTOS, ANTITOXICOS Y PARAS" },
        {Cat3: "ANTITIMPÀNICO"},
      ],
      
      cat2: { $nin: ["MEDICINA MASCOTAS"] } 

    };


    // Calcula el índice de inicio y la cantidad de elementos a mostrar
    const startIndex = (pageNumber - 1) * limitNumber;

    const [ total, productos ] = await Promise.all([
      ProductoMSchema.find(query).countDocuments(),
      ProductoMSchema.find(query)
        .sort({ Nombre: 1 }) // Ordena alfabéticamente por el campo "Nombre"
        .skip(startIndex)
        .limit(limitNumber)
    ]);

    // Obtén todas las marcas únicas de los productos
    const marcas = await ProductoMSchema.distinct('Marca', query);
    // Crea un arreglo de objetos para las marcas en el formato requerido
    const marcasArray = marcas.map((marca) => ({ Marca: marca }));


    // Obtén todos los componentes únicos 
    const componentes = await ProductoMSchema.distinct('cat4', query);
    // Crea un arreglo de objetos para las marcas en el formato requerido
    const componentesArray = componentes.map((component) => ({ cat4: component }));

    // Calcula el número total de páginas
    const totalPages = Math.ceil(total / limitNumber);

    // Construye el objeto de respuesta con los datos paginados y los metadatos
    const response = {
      total,
      totalPages,
      currentPage: pageNumber,
      productos,
      marcas: marcasArray,
      componentes: componentesArray
    };

    res.status(200).json(response);

};

//ANTISEPTICOS Y DESINFECTANTES
const antisepticosDesinfectantes =  async(req, res) => {

    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 16;

    //Condiciones para el filtro
    const query = {
      Cat3: "ANTISEPTICOS-DESINFECTANTES",
            $or: [
                { cat2: { $nin: ["MEDICINA MASCOTAS"] } }
            ]
    };


    // Calcula el índice de inicio y la cantidad de elementos a mostrar
    const startIndex = (pageNumber - 1) * limitNumber;

    const [ total, productos ] = await Promise.all([
      ProductoMSchema.find(query).countDocuments(),
      ProductoMSchema.find(query)
                      .sort({ Nombre: 1 }) // Ordena alfabéticamente por el campo "Nombre"
                      .skip(startIndex)
                      .limit(limitNumber)
    ]);

    // Obtén todas las marcas únicas de los productos
    const marcas = await ProductoMSchema.distinct('Marca', query);
    // Crea un arreglo de objetos para las marcas en el formato requerido
    const marcasArray = marcas.map((marca) => ({ Marca: marca }));

    // Obtén todos los componentes únicos 
    const componentes = await ProductoMSchema.distinct('cat4', query);
    // Crea un arreglo de objetos para las marcas en el formato requerido
    const componentesArray = componentes.map((component) => ({ cat4: component }));

    // Calcula el número total de páginas
    const totalPages = Math.ceil(total / limitNumber);

    // Construye el objeto de respuesta con los datos paginados y los metadatos
    const response = {
      total,
      totalPages,
      currentPage: pageNumber,
      productos,
      marcas: marcasArray,
      componentes: componentesArray
    };

    res.status(200).json(response);
    

};

//ANTIBIOTICOS
const antibioticos =  async(req, res) => {

    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 16;

    //Condiciones para el filtro
    const query = {
            Cat3: "ANTIBIOTICOS",
            Cat3: "ANTIMASTITICOS",
            $or: [
                { cat2: { $nin: ["MEDICINA MASCOTAS"] } }
            ]
    };


    // Calcula el índice de inicio y la cantidad de elementos a mostrar
    const startIndex = (pageNumber - 1) * limitNumber;

    const [ total, productos ] = await Promise.all([
      ProductoMSchema.find(query).countDocuments(),
      ProductoMSchema.find(query)
                      .sort({ Nombre: 1 }) // Ordena alfabéticamente por el campo "Nombre"
                      .skip(startIndex)
                      .limit(limitNumber)
    ]);

    // Obtén todas las marcas únicas de los productos
    const marcas = await ProductoMSchema.distinct('Marca', query);
    // Crea un arreglo de objetos para las marcas en el formato requerido
    const marcasArray = marcas.map((marca) => ({ Marca: marca }));

    // Obtén todos los componentes únicos 
    const componentes = await ProductoMSchema.distinct('cat4', query);
    // Crea un arreglo de objetos para las marcas en el formato requerido
    const componentesArray = componentes.map((component) => ({ cat4: component }));

    // Calcula el número total de páginas
    const totalPages = Math.ceil(total / limitNumber);

    // Construye el objeto de respuesta con los datos paginados y los metadatos
    const response = {
      total,
      totalPages,
      currentPage: pageNumber,
      productos,
      marcas: marcasArray,
      componentes: componentesArray
    };

    res.status(200).json(response);

};

//ANTIDIARREICOS
const antidiarreicos =  async(req, res) => {

    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 16;

    //Condiciones para el filtro
    const query = {
            Cat3: "ANTIDIARREICOS",
            $or: [
                { cat2: { $nin: ["MEDICINA MASCOTAS"] } }
            ]
    };


    // Calcula el índice de inicio y la cantidad de elementos a mostrar
    const startIndex = (pageNumber - 1) * limitNumber;

    const [ total, productos ] = await Promise.all([
      ProductoMSchema.find(query).countDocuments(),
      ProductoMSchema.find(query)
                      .sort({ Nombre: 1 }) // Ordena alfabéticamente por el campo "Nombre"
                      .skip(startIndex)
                      .limit(limitNumber)
    ]);

    // Obtén todas las marcas únicas de los productos
    const marcas = await ProductoMSchema.distinct('Marca', query);
    // Crea un arreglo de objetos para las marcas en el formato requerido
    const marcasArray = marcas.map((marca) => ({ Marca: marca }));

    // Obtén todos los componentes únicos 
    const componentes = await ProductoMSchema.distinct('cat4', query);
    // Crea un arreglo de objetos para las marcas en el formato requerido
    const componentesArray = componentes.map((component) => ({ cat4: component }));

    // Calcula el número total de páginas
    const totalPages = Math.ceil(total / limitNumber);

    // Construye el objeto de respuesta con los datos paginados y los metadatos
    const response = {
      total,
      totalPages,
      currentPage: pageNumber,
      productos,
      marcas: marcasArray,
      componentes: componentesArray
    };

    res.status(200).json(response);

};


//BAÑOS, ECTOPARASITARIOS Y MATAGUSANOS
const bañosEctoparasitariosMatagusanos =  async(req, res) => {

    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 16;

    //Condiciones para el filtro
    const query = {
          Cat3: "ANTIPARASITARIO EXTERNO (BAÑOS",
          Cat3: "TOPICO ANTIPARASITARIO",
          $or: [
              { cat2: { $nin: ["MEDICINA MASCOTAS"] } }
          ]
      };


    // Calcula el índice de inicio y la cantidad de elementos a mostrar
    const startIndex = (pageNumber - 1) * limitNumber;

    const [ total, productos ] = await Promise.all([
      ProductoMSchema.find(query).countDocuments(),
      ProductoMSchema.find(query)
                      .sort({ Nombre: 1 }) // Ordena alfabéticamente por el campo "Nombre"
                      .skip(startIndex)
                      .limit(limitNumber)
    ]);

    // Obtén todas las marcas únicas de los productos
    const marcas = await ProductoMSchema.distinct('Marca', query);
    // Crea un arreglo de objetos para las marcas en el formato requerido
    const marcasArray = marcas.map((marca) => ({ Marca: marca }));

    // Obtén todos los componentes únicos 
    const componentes = await ProductoMSchema.distinct('cat4', query);
    // Crea un arreglo de objetos para las marcas en el formato requerido
    const componentesArray = componentes.map((component) => ({ cat4: component }));

    // Calcula el número total de páginas
    const totalPages = Math.ceil(total / limitNumber);

    // Construye el objeto de respuesta con los datos paginados y los metadatos
    const response = {
      total,
      totalPages,
      currentPage: pageNumber,
      productos,
      marcas: marcasArray,
      componentes: componentesArray
    };

    res.status(200).json(response);

};


//BIOLÓGICOS
const biologicos =  async(req, res) => {

    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 16;

    //Condiciones para el filtro
    const query = {
            Cat3: "VACUNAS Y BACTERINAS",
            $or: [
                { cat2: { $nin: ["MEDICINA MASCOTAS"] } }
            ]
    };


    // Calcula el índice de inicio y la cantidad de elementos a mostrar
    const startIndex = (pageNumber - 1) * limitNumber;

    const [ total, productos ] = await Promise.all([
      ProductoMSchema.find(query).countDocuments(),
      ProductoMSchema.find(query)
                      .sort({ Nombre: 1 }) // Ordena alfabéticamente por el campo "Nombre"
                      .skip(startIndex)
                      .limit(limitNumber)
    ]);

    // Obtén todas las marcas únicas de los productos
    const marcas = await ProductoMSchema.distinct('Marca', query);
    // Crea un arreglo de objetos para las marcas en el formato requerido
    const marcasArray = marcas.map((marca) => ({ Marca: marca }));

    // Obtén todos los componentes únicos 
    const componentes = await ProductoMSchema.distinct('cat4', query);
    // Crea un arreglo de objetos para las marcas en el formato requerido
    const componentesArray = componentes.map((component) => ({ cat4: component }));

    // Calcula el número total de páginas
    const totalPages = Math.ceil(total / limitNumber);

    // Construye el objeto de respuesta con los datos paginados y los metadatos
    const response = {
      total,
      totalPages,
      currentPage: pageNumber,
      productos,
      marcas: marcasArray,
      componentes: componentesArray
    };

    res.status(200).json(response);

};

//HEMOPARASITICIDAS
const hemoparasiticidas =  async(req, res) => {

    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 16;

    //Condiciones para el filtro
    const query = {
            Cat3: "HEMOPARASITICIDA",
            $or: [
                { cat2: { $nin: ["MEDICINA MASCOTAS"] } }
            ]
    };


    // Calcula el índice de inicio y la cantidad de elementos a mostrar
    const startIndex = (pageNumber - 1) * limitNumber;

    const [ total, productos ] = await Promise.all([
      ProductoMSchema.find(query).countDocuments(),
      ProductoMSchema.find(query)
                      .sort({ Nombre: 1 }) // Ordena alfabéticamente por el campo "Nombre"
                      .skip(startIndex)
                      .limit(limitNumber)
    ]);

    // Obtén todas las marcas únicas de los productos
    const marcas = await ProductoMSchema.distinct('Marca', query);
    // Crea un arreglo de objetos para las marcas en el formato requerido
    const marcasArray = marcas.map((marca) => ({ Marca: marca }));

    // Obtén todos los componentes únicos 
    const componentes = await ProductoMSchema.distinct('cat4', query);
    // Crea un arreglo de objetos para las marcas en el formato requerido
    const componentesArray = componentes.map((component) => ({ cat4: component }));

    // Calcula el número total de páginas
    const totalPages = Math.ceil(total / limitNumber);

    // Construye el objeto de respuesta con los datos paginados y los metadatos
    const response = {
      total,
      totalPages,
      currentPage: pageNumber,
      productos,
      marcas: marcasArray,
      componentes: componentesArray
    };

    res.status(200).json(response);

};


//HORMONALES
const hormonales =  async(req, res) => {

    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 16;

    //Condiciones para el filtro
    const query = {
            Cat3: "HORMONALES PARA REPRODUCCION",
            $or: [
                { cat2: { $nin: ["MEDICINA MASCOTAS"] } }
            ]
    };


    // Calcula el índice de inicio y la cantidad de elementos a mostrar
    const startIndex = (pageNumber - 1) * limitNumber;

    const [ total, productos ] = await Promise.all([
      ProductoMSchema.find(query).countDocuments(),
      ProductoMSchema.find(query)
                      .sort({ Nombre: 1 }) // Ordena alfabéticamente por el campo "Nombre"
                      .skip(startIndex)
                      .limit(limitNumber)
    ]);

    // Obtén todas las marcas únicas de los productos
    const marcas = await ProductoMSchema.distinct('Marca', query);
    // Crea un arreglo de objetos para las marcas en el formato requerido
    const marcasArray = marcas.map((marca) => ({ Marca: marca }));

    // Obtén todos los componentes únicos 
    const componentes = await ProductoMSchema.distinct('cat4', query);
    // Crea un arreglo de objetos para las marcas en el formato requerido
    const componentesArray = componentes.map((component) => ({ cat4: component }));

    // Calcula el número total de páginas
    const totalPages = Math.ceil(total / limitNumber);

    // Construye el objeto de respuesta con los datos paginados y los metadatos
    const response = {
      total,
      totalPages,
      currentPage: pageNumber,
      productos,
      marcas: marcasArray,
      componentes: componentesArray
    };

    res.status(200).json(response);

};

//VITAMINAS Y MINERALES
const vitaminasMinerales =  async(req, res) => {

    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 16;

    //Condiciones para el filtro
    const query = {
            Cat3: "RECONSTITUYENTES, REHIDRATANTE",
            Cat3: "VITAMINAS",
            $or: [
                { cat2: { $nin: ["MEDICINA MASCOTAS"] } }
            ]
    };


    // Calcula el índice de inicio y la cantidad de elementos a mostrar
    const startIndex = (pageNumber - 1) * limitNumber;

    const [ total, productos ] = await Promise.all([
      ProductoMSchema.find(query).countDocuments(),
      ProductoMSchema.find(query)
                      .sort({ Nombre: 1 }) // Ordena alfabéticamente por el campo "Nombre"
                      .skip(startIndex)
                      .limit(limitNumber)
    ]);

    // Obtén todas las marcas únicas de los productos
    const marcas = await ProductoMSchema.distinct('Marca', query);
    // Crea un arreglo de objetos para las marcas en el formato requerido
    const marcasArray = marcas.map((marca) => ({ Marca: marca }));

    // Obtén todos los componentes únicos 
    const componentes = await ProductoMSchema.distinct('cat4', query);
    // Crea un arreglo de objetos para las marcas en el formato requerido
    const componentesArray = componentes.map((component) => ({ cat4: component }));

    // Calcula el número total de páginas
    const totalPages = Math.ceil(total / limitNumber);

    // Construye el objeto de respuesta con los datos paginados y los metadatos
    const response = {
      total,
      totalPages,
      currentPage: pageNumber,
      productos,
      marcas: marcasArray,
      componentes: componentesArray
    };

    res.status(200).json(response);

};






//------------------------------------- Implementos Veternaria -----------------------------------------//

//VITAMINAS Y MINERALES
const implementosVeterinarios =  async(req, res) => {

    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 16;

    //Condiciones para el filtro
    const query = {
            cat2: "IMPLEMENTOS VETERINARIOS",
            $or: [
                { cat2: { $nin: ["MANEJO E IDENTIFICACION"] } }
            ]
    };


    // Calcula el índice de inicio y la cantidad de elementos a mostrar
    const startIndex = (pageNumber - 1) * limitNumber;

    const [ total, productos ] = await Promise.all([
      ProductoMSchema.find(query).countDocuments(),
      ProductoMSchema.find(query)
                      .sort({ Nombre: 1 }) // Ordena alfabéticamente por el campo "Nombre"
                      .skip(startIndex)
                      .limit(limitNumber)
    ]);

    // Obtén todas las marcas únicas de los productos
    const marcas = await ProductoMSchema.distinct('Marca', query);
    // Crea un arreglo de objetos para las marcas en el formato requerido
    const marcasArray = marcas.map((marca) => ({ Marca: marca }));

    // Obtén todos los componentes únicos 
    const componentes = await ProductoMSchema.distinct('cat4', query);
    // Crea un arreglo de objetos para las marcas en el formato requerido
    const componentesArray = componentes.map((component) => ({ cat4: component }));

    // Calcula el número total de páginas
    const totalPages = Math.ceil(total / limitNumber);

    // Construye el objeto de respuesta con los datos paginados y los metadatos
    const response = {
      total,
      totalPages,
      currentPage: pageNumber,
      productos,
      marcas: marcasArray,
      componentes: componentesArray
    };

    res.status(200).json(response);

};



//------------------------------------- Fereteria Agrícoña -----------------------------------------//

//VITAMINAS Y MINERALES
const ferreteriaAgricola =  async(req, res) => {

  const { page, limit } = req.query;
  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 16;

  //Condiciones para el filtro
  const query = {
          cat1: "FERRETERIA",
          $or: [
              { cat2: { $nin: ["ELECTRICIDAD"] } }
          ]
            };


  // Calcula el índice de inicio y la cantidad de elementos a mostrar
  const startIndex = (pageNumber - 1) * limitNumber;

  const [ total, productos ] = await Promise.all([
    ProductoMSchema.find(query).countDocuments(),
    ProductoMSchema.find(query)
                    .sort({ Nombre: 1 }) // Ordena alfabéticamente por el campo "Nombre"
                    .skip(startIndex)
                    .limit(limitNumber)
  ]);

  // Obtén todas las marcas únicas de los productos
  const marcas = await ProductoMSchema.distinct('Marca', query);
  // Crea un arreglo de objetos para las marcas en el formato requerido
  const marcasArray = marcas.map((marca) => ({ Marca: marca }));

  // Obtén todos los componentes únicos 
  const componentes = await ProductoMSchema.distinct('cat4', query);
  // Crea un arreglo de objetos para las marcas en el formato requerido
  const componentesArray = componentes.map((component) => ({ cat4: component }));

  // Calcula el número total de páginas
  const totalPages = Math.ceil(total / limitNumber);

  // Construye el objeto de respuesta con los datos paginados y los metadatos
  const response = {
    total,
    totalPages,
    currentPage: pageNumber,
    productos,
    marcas: marcasArray,
    componentes: componentesArray
  };

  res.status(200).json(response);

};


//Electricidad
const electricidad =  async(req, res) => {

  const { page, limit } = req.query;
  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 16;

  //Condiciones para el filtro
  const query = {cat2: "ELECTRICIDAD"};



  // Calcula el índice de inicio y la cantidad de elementos a mostrar
  const startIndex = (pageNumber - 1) * limitNumber;

  const [ total, productos ] = await Promise.all([
    ProductoMSchema.find(query).countDocuments(),
    ProductoMSchema.find(query)
                    .sort({ Nombre: 1 }) // Ordena alfabéticamente por el campo "Nombre"
                    .skip(startIndex)
                    .limit(limitNumber)
  ]);

  // Obtén todas las marcas únicas de los productos
  const marcas = await ProductoMSchema.distinct('Marca', query);
  // Crea un arreglo de objetos para las marcas en el formato requerido
  const marcasArray = marcas.map((marca) => ({ Marca: marca }));

  // Obtén todos los componentes únicos 
  const componentes = await ProductoMSchema.distinct('cat4', query);
  // Crea un arreglo de objetos para las marcas en el formato requerido
  const componentesArray = componentes.map((component) => ({ cat4: component }));

  // Calcula el número total de páginas
  const totalPages = Math.ceil(total / limitNumber);

  // Construye el objeto de respuesta con los datos paginados y los metadatos
  const response = {
    total,
    totalPages,
    currentPage: pageNumber,
    productos,
    marcas: marcasArray,
    componentes: componentesArray
  };

  res.status(200).json(response);

};




//------------------------------------- Salud Pública -----------------------------------------//

const controlDePlaga =  async(req, res) => {

  const { page, limit } = req.query;
  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 16;

  //Condiciones para el filtro
  const query = {
    cat1: "SALUD PUBLICA" ,
          $or: [
            { Cat3: { $nin: ["DESINFECTANTES"] } },
        ]
      };


  // Calcula el índice de inicio y la cantidad de elementos a mostrar
  const startIndex = (pageNumber - 1) * limitNumber;

  const [ total, productos ] = await Promise.all([
    ProductoMSchema.find(query).countDocuments(),
    ProductoMSchema.find(query)
                    .sort({ Nombre: 1 }) // Ordena alfabéticamente por el campo "Nombre"
                    .skip(startIndex)
                    .limit(limitNumber)
  ]);

  // Obtén todas las marcas únicas de los productos
  const marcas = await ProductoMSchema.distinct('Marca', query);
  // Crea un arreglo de objetos para las marcas en el formato requerido
  const marcasArray = marcas.map((marca) => ({ Marca: marca }));

  // Obtén todos los componentes únicos 
  const componentes = await ProductoMSchema.distinct('cat4', query);
  // Crea un arreglo de objetos para las marcas en el formato requerido
  const componentesArray = componentes.map((component) => ({ cat4: component }));

  // Calcula el número total de páginas
  const totalPages = Math.ceil(total / limitNumber);

  // Construye el objeto de respuesta con los datos paginados y los metadatos
  const response = {
    total,
    totalPages,
    currentPage: pageNumber,
    productos,
    marcas: marcasArray,
    componentes: componentesArray
  };

  res.status(200).json(response);

};






module.exports = {
    otrosAgroquimicos,
    semillas,
    hortalizas,
    maizHibrido,
    cercasAlambreyElectricas,
    maquinarias,
    maquinariasTotal,
    bambasDeAgua,
    analgesicosAntiinflamatorios,
    antisepticosDesinfectantes,
    antibioticos,
    antidiarreicos,
    bañosEctoparasitariosMatagusanos,
    biologicos,
    hemoparasiticidas,
    hormonales,
    vitaminasMinerales,
    implementosVeterinarios,
    ferreteriaAgricola,
    electricidad,
    controlDePlaga,
}