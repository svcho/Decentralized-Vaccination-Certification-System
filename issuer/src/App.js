import React from 'react';
import { createVerifiableCredentialJwt } from 'did-jwt-vc';
import Settings from '../src/config/settings.json';
import QRCode from 'qrcode';
import EthrDID from 'ethr-did';
import Web3 from 'web3';
import './App.css';

const provider = new Web3.providers.HttpProvider(Settings.HTTP_PROVDER)
const ethrDid = new EthrDID({
  address: Settings.WALLET_ADDRESS,
  privateKey: Settings.WALLET_PRIVATE_KEY,
  provider: provider
})

function App() {

  var availableVaccines = [{ id: 1, type: 'COVID-19', manufacturer: 'Johnsson & Johnsson', charge: '12345' }, { id: 2, type: 'COVID-19', manufacturer: 'AstraZeneca', charge: '435765' }, { id: 3, type: 'COVID-19', manufacturer: 'Pfizer', charge: '876543' }]
  var selectedVaccine = 0

  return (
    <div className="App">

      <div class="container">
        <h1>Vaccination Center Portal</h1>

        <div class="row">
          <div class="col-3">
            <label>Available Vaccines</label>
          </div>
          <div class="col">
            <select class="form-control" onChange={e => selectedVaccine = e.target.options.selectedIndex}>
              {availableVaccines.map(e =>
                <option value={e.id}>{"(" + e.type + ") " + e.manufacturer}</option>
              )}
            </select>
          </div>
        </div>

        <div class="row">
          <div class="col-3">
            <label>Patient ID</label>
          </div>
          <div class="col">
            <input type="text" class="form-control" id="holder_did" placeholder="Enter patient's DID (e.g., did:ethr:0xdac8ac800163d71f3bf45a2b7ac1581343e2f521)" />
          </div>
        </div>

        <div class="row">
          <div class="col">
            <button class="btn btn-primary btn-lg btn-block" onClick={CreateVerifiableCredential}>Issue Vaccination Confirmation</button>
          </div>
        </div>

        <div class="row">
          <div class="col">
            <canvas id="canvas"></canvas>
            <input type="text" class="form-control" id="issued_vc" readOnly hidden />
          </div>
        </div>
      </div>
    </div>
  );

  async function CreateVerifiableCredential() {

    var patientDID = document.getElementById('holder_did').value;

    if (patientDID.length < 10 || selectedVaccine > availableVaccines.length) {
      alert("Invalid DID");
      return;
    }

    const vcPayload = {
      sub: patientDID.toLocaleLowerCase().trim(),
      vc: {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential'],
        credentialSubject: {
          vaccine: {
            type: availableVaccines[selectedVaccine].type,
            manufacturer: availableVaccines[selectedVaccine].manufacturer,
            charge: availableVaccines[selectedVaccine].charge,
            iat: new Date()
          }
        }
      }
    }

    const vcJwt = await createVerifiableCredentialJwt(vcPayload, ethrDid)
    document.getElementById('issued_vc').value = vcJwt
    document.getElementById('issued_vc').hidden = false
    var canvas = document.getElementById('canvas')

    QRCode.toCanvas(canvas, vcJwt, function (error) {
      if (error) console.error(error)
    })
  }
}

export default App;
