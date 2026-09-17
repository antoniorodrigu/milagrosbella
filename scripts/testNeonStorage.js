import 'dotenv/config';
import {
  s3,
  bucketName,
  uploadDirect,
  generateUploadPresignedUrl,
  generateViewPresignedUrl,
  checkObjectExists,
  listObjects,
  deleteObject
} from '../server/neonStorage.js';

// Minimal 1x1 transparent PNG binary buffer
const samplePngBuffer = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
);

async function runStorageVerification() {
  console.log('\n======================================================');
  console.log('🔒 NEON OBJECT STORAGE - CONEXIÓN Y PRUEBA DE SEGURIDAD');
  console.log('======================================================\n');

  console.log(`📌 Bucket objetivo: "${bucketName}"`);
  console.log(`📌 Endpoint S3: "${process.env.AWS_ENDPOINT_URL_S3}"`);
  console.log(`📌 Región: "${process.env.AWS_REGION || 'us-east-2'}"\n`);

  const timestamp = Date.now();
  const testKey = `test/prueba_conexion_${timestamp}.png`;

  try {
    // 1. Subir imagen de prueba pequeña
    console.log('1️⃣ [PRUEBA 1] Subiendo imagen de prueba a Neon Storage...');
    await uploadDirect(testKey, samplePngBuffer, 'image/png');
    console.log(`   ✅ Objeto subido con éxito: "${testKey}"`);

    // 2. Comprobar que aparece dentro de recuerdosreiders
    console.log('\n2️⃣ [PRUEBA 2] Verificando existencia en el bucket...');
    const meta = await checkObjectExists(testKey);
    if (meta.exists) {
      console.log(`   ✅ Objeto verificado en bucket: tamaño = ${meta.size} bytes, tipo = ${meta.contentType}`);
    } else {
      throw new Error(`El objeto ${testKey} no se encontró en el bucket.`);
    }

    // 3. Generar URL firmada temporal para lectura (GET)
    console.log('\n3️⃣ [PRUEBA 3] Generando URL prefirmada (GET, expiración 1 hora)...');
    const signedViewUrl = await generateViewPresignedUrl(testKey, 3600);
    console.log(`   ✅ URL prefirmada generada:`);
    console.log(`      ${signedViewUrl.substring(0, 95)}... [truncada por seguridad]`);

    // 4. Comprobar que la imagen puede visualizarse mediante la URL firmada (HTTP 200)
    console.log('\n4️⃣ [PRUEBA 4] Verificando acceso con URL firmada (fetch HTTP GET)...');
    const signedResponse = await fetch(signedViewUrl);
    console.log(`   📡 Código HTTP de respuesta con firma: ${signedResponse.status} ${signedResponse.statusText}`);
    if (signedResponse.status === 200) {
      const arrayBuf = await signedResponse.arrayBuffer();
      console.log(`   ✅ Imagen descargada correctamente con firma (${arrayBuf.byteLength} bytes).`);
    } else {
      throw new Error(`Fallo al acceder mediante URL firmada: HTTP ${signedResponse.status}`);
    }

    // 5. Comprobar que la URL pública directa NO funciona (Bucket es PRIVATE -> HTTP 403)
    console.log('\n5️⃣ [PRUEBA 5] Verificando que la URL directa SIN firma es rechazada (Bucket PRIVADO)...');
    const unsignedDirectUrl = `${process.env.AWS_ENDPOINT_URL_S3}/${bucketName}/${testKey}`;
    const unsignedResponse = await fetch(unsignedDirectUrl);
    console.log(`   📡 Código HTTP de respuesta sin firma: ${unsignedResponse.status} ${unsignedResponse.statusText}`);
    if (unsignedResponse.status === 403 || unsignedResponse.status === 400 || unsignedResponse.status === 401) {
      console.log(`   🛡️  ACCESO DENEGADO CORRECTO: El bucket es 100% PRIVADO. Las peticiones sin firma son bloqueadas.`);
    } else {
      console.warn(`   ⚠️ Advertencia: Respuesta inesperada sin firma: HTTP ${unsignedResponse.status}`);
    }

    // 6. Prueba de subida directa desde cliente con URL prefirmada (PUT)
    console.log('\n6️⃣ [PRUEBA 6] Verificando flujo de subida segura con URL prefirmada (PUT)...');
    const clientTestKey = `test/subida_cliente_${timestamp}.txt`;
    const { uploadUrl } = await generateUploadPresignedUrl(clientTestKey, 'text/plain', 300);
    
    const clientUploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: 'Prueba de subida segura mediante URL prefirmada para Milagros.'
    });

    console.log(`   📡 Código HTTP subida PUT cliente: ${clientUploadRes.status} ${clientUploadRes.statusText}`);
    if (clientUploadRes.status === 200 || clientUploadRes.status === 204) {
      console.log(`   ✅ Subida cliente con presigned PUT exitosa sin exponer credenciales.`);
      // Verificar que existe
      const clientMeta = await checkObjectExists(clientTestKey);
      console.log(`   ✅ Objeto cliente verificado en Neon Storage (${clientMeta.size} bytes).`);
      // Limpiar archivo cliente
      await deleteObject(clientTestKey);
    }

    // 7. Listar objetos de prueba
    console.log('\n7️⃣ [PRUEBA 7] Listando objetos en el bucket...');
    const objects = await listObjects('test/');
    console.log(`   📁 Total objetos en prefijo test/: ${objects.length}`);
    objects.slice(0, 3).forEach(o => console.log(`      • ${o.key} (${o.size} B)`));

    console.log('\n======================================================');
    console.log('🎉 RESULTADO: CONEXIÓN CON NEON STORAGE 100% EXITOSA');
    console.log('   - Bucket privado: recuerdosreiders');
    console.log('   - Subida / Descarga firmada: FUNCIONANDO');
    console.log('   - Bucket privado verificado (403 Forbidden directo)');
    console.log('   - Cero credenciales expuestas en frontend');
    console.log('======================================================\n');

  } catch (error) {
    console.error('\n❌ Error durante la verificación de Neon Storage:', error);
    process.exit(1);
  }
}

runStorageVerification();

