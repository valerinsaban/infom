import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';
import * as convert from 'xml-js';

@Injectable({
  providedIn: 'root'
})
export class MegaPrintService {

  constructor(
    private httpClient: HttpClient
  ) { }

  usuario: string = '974250';
  apikey: string = 'qiDMo9LlPJRyiDzWOOtw5pB';

  async solicitarToken() {
    let headers = new HttpHeaders({
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'text/xml'
    });

    let body = `<?xml version='1.0' encoding='UTF-8'?>
    <SolicitaTokenRequest>
        <usuario>${this.usuario}</usuario>
        <apikey>${this.apikey}</apikey>
    </SolicitaTokenRequest>`;

    let res: any = await this.httpClient.post('/solicitarToken', body, { headers, responseType: 'text' }).toPromise();
    var xml = convert.xml2json(res, { compact: true, spaces: 4 });
    let solicitud = JSON.parse(xml);
    if (solicitud.SolicitaTokenResponse.tipo_respuesta._text == '0') {
      return {resultado: true, res: solicitud.SolicitaTokenResponse};
    } else {
      return {resultado: false, res: solicitud.SolicitaTokenResponse};
    }
  }

  async certificar(token: any) {    
    let headers = new HttpHeaders({
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'text/xml',
      'Authorization': `Bearer ${token}`
    });

    let cont = `<?xml version="1.0" encoding="UTF-8"?>
    <dte:GTDocumento xmlns:dte="http://www.sat.gob.gt/dte/fel/0.2.0" Version="0.1">
      <dte:SAT ClaseDocumento="dte">
          <dte:DTE ID="DatosCertificados">
              <dte:DatosEmision ID="DatosEmision">
                  <dte:DatosGenerales CodigoMoneda="GTQ" FechaHoraEmision="2023-11-01T00:00:00.000-06:00" Tipo="FACT" />
                  <dte:Emisor AfiliacionIVA="GEN" CodigoEstablecimiento="1" CorreoEmisor="desarrollo@infom.gob.gt" NITEmisor="974250" NombreComercial="INSTITUTO DE FOMENTO MUNICIPAL" NombreEmisor="INSTITUTO DE FOMENTO MUNICIPAL -INFOM-">
                      <dte:DireccionEmisor>
                          <dte:Direccion>CIUDAD</dte:Direccion>
                          <dte:CodigoPostal>0</dte:CodigoPostal>
                          <dte:Municipio>GUATEMALA</dte:Municipio>
                          <dte:Departamento>GUATEMALA</dte:Departamento>
                          <dte:Pais>GT</dte:Pais>
                      </dte:DireccionEmisor>
                  </dte:Emisor>
                  <dte:Receptor CorreoReceptor="" IDReceptor="3666527290101" NombreReceptor="VALERIN SABAN" TipoEspecial="CUI">
                      <dte:DireccionReceptor>
                          <dte:Direccion>CUIDAD</dte:Direccion>
                          <dte:CodigoPostal>0</dte:CodigoPostal>
                          <dte:Municipio/>
                          <dte:Departamento />
                          <dte:Pais>GT</dte:Pais>
                      </dte:DireccionReceptor>
                  </dte:Receptor>
                  <dte:Frases>
                    <dte:Frase CodigoEscenario="1" TipoFrase="1" />                                     
                      <dte:Frase CodigoEscenario="1" TipoFrase="2" />
                  </dte:Frases>
                  <dte:Items>
                      <dte:Item BienOServicio="B" NumeroLinea="1">
          <dte:Cantidad>1</dte:Cantidad>
          <dte:UnidadMedida>UNI</dte:UnidadMedida>
          <dte:Descripcion>Prueba fact en desarrollo</dte:Descripcion>
          <dte:PrecioUnitario>0.1</dte:PrecioUnitario>
          <dte:Precio>0.1</dte:Precio>
          <dte:Descuento>0</dte:Descuento>
          <dte:Impuestos>
              <dte:Impuesto>
                  <dte:NombreCorto>IVA</dte:NombreCorto>
                  <dte:CodigoUnidadGravable>1</dte:CodigoUnidadGravable>
                  <dte:MontoGravable>0.089286</dte:MontoGravable>
                  <dte:MontoImpuesto>0.010714</dte:MontoImpuesto>
              </dte:Impuesto>
          </dte:Impuestos>
          <dte:Total>0.1</dte:Total>
      </dte:Item>
                  </dte:Items>
                  <dte:Totales>
                      <dte:TotalImpuestos>
                          <dte:TotalImpuesto NombreCorto="IVA" TotalMontoImpuesto="0.010714" />
                      </dte:TotalImpuestos>
                      <dte:GranTotal>0.1</dte:GranTotal>
                  </dte:Totales>
              </dte:DatosEmision>              
          </dte:DTE>
          <dte:Adenda>
              <dte:AdendaDetail>
                  <dte:AdendaSummary>
                      <dte:Valor1/>
                      <dte:Valor2/>
                      <dte:Valor3/>
                      <dte:Valor4/>
                      <dte:Valor5/>
                      <dte:Valor6/>
                      <dte:Valor7/>
                      <dte:Valor8/>
                      <dte:Valor9/>
                      <dte:Valor10/>
                      <dte:Valor11/>
                      <dte:Valor12/>
                      <dte:Valor13/>
                      <dte:Valor14/>
                      <dte:Valor15/>
                      <dte:Valor16/>
                      <dte:Valor17/>
                      <dte:Valor18/>
                      <dte:Valor19>FORMA 18-FA-INFOM-CCC</dte:Valor19>
                      <dte:Valor20>18056</dte:Valor20>
                  </dte:AdendaSummary>
              </dte:AdendaDetail>
          </dte:Adenda>
      </dte:SAT>
    </dte:GTDocumento>`;

    let body = `<?xml version="1.0" encoding="UTF-8"?>
    <FirmaDocumentoRequest id="D0E513C6-0DD8-4304-A4BE-B2431ECA6B37">
        <xml_dte>
            <![CDATA[${cont}]]>
        </xml_dte>
    </FirmaDocumentoRequest>`;

    let res: any = await this.httpClient.post('/solicitaFirma', body, { headers, responseType: 'text' }).toPromise();
    var xml = convert.xml2json(res, { compact: true, spaces: 4 });
    let firma = JSON.parse(xml);
    if (firma.FirmaDocumentoResponse.tipo_respuesta._text == '0') {
      let dte = firma.FirmaDocumentoResponse.xml_dte._text;
      let uuid = firma.FirmaDocumentoResponse.uuid._text;

      body = `<?xml version="1.0" encoding="UTF-8"?>
      <RegistraDocumentoXMLRequest id="${uuid}">
          <xml_dte>
              <![CDATA[${dte}]]>
          </xml_dte>
      </RegistraDocumentoXMLRequest>`;

      res = await this.httpClient.post('/registrarDocumentoXML', body, { headers, responseType: 'text' }).toPromise();
      xml = convert.xml2json(res, { compact: true, spaces: 4 });
      let certificado = JSON.parse(xml);

      if (certificado.RegistraDocumentoXMLResponse.tipo_respuesta._text == '0') {
        return {resultado: true, res: certificado.RegistraDocumentoXMLResponse};
      } else {
        return {resultado: false, res: certificado.RegistraDocumentoXMLResponse};
      }

    } else {
      return {resultado: false, res: firma.FirmaDocumentoResponse};
    }
  }

  async imprimir(token: any, uuid: any) {    
    let headers = new HttpHeaders({
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'text/xml',
      'Authorization': `Bearer ${token}`
    });

    let body = `<?xml version="1.0" encoding="UTF-8"?>
    <RetornaPDFRequest>
        <uuid>${uuid}</uuid>
    </RetornaPDFRequest>`;

    let res: any = await this.httpClient.post('/retornarPDF', body, { headers, responseType: 'text' }).toPromise();
    var xml = convert.xml2json(res, { compact: true, spaces: 4 });
    let pdf = JSON.parse(xml);    
    if (pdf.RetornaPDFResponse.tipo_respuesta._text == '0') {
      return {resultado: true, res: pdf.RetornaPDFResponse};
    } else {
      return {resultado: false, res: pdf.RetornaPDFResponse};
    }
  }

}
