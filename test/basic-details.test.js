import { html, fixture, expect } from '@open-wc/testing';
import Sinon from 'sinon';
import { Router } from '@vaadin/router';
import '../src/LoanBasicDetails/BasicDetails.js';

describe('Basic details', () => {
  let el;
  before(async () => {
    el = await fixture(html`<basic-details></basic-details>`);
  });
  afterEach(() => {
    Sinon.restore();
  })
  it('is accessible', () => {
    expect(el).to.be.accessible;
  });
  it(' constructor initializes values', () => {
    expect(el.amount).to.equal(10000);

  });
  it('_numToWord() - renders in words', () => {
    const spy = Sinon.spy(el, '_numToWord');
    el._numToWord();
    el.shadowRoot.querySelector('.amount').value = 10000;
    expect(spy).to.have.called
    expect(el.shadowRoot.querySelector('#word').innerHTML.trim()).to.equal('ten thousand');
  });
  it("_toDashboard() - called Router's go() to navigate to dashboard", () => {
    const spy = Sinon.spy(Router, 'go');
    el._toDashboard();
    expect(spy).to.have.called;
    expect(spy.firstCall.args[0]).to.equal('/')
  });
  it('_captureDetails() - makes a post request with the inputs', ()=>{
    const spy = Sinon.spy(window, 'fetch');
    el.shadowRoot.querySelector('.type').value = 'Personal Loan';
    el.shadowRoot.querySelector('.amount').value = '10000';
    el.shadowRoot.querySelector('.period').value = '10';
    el._captureDetails();
    expect(spy).to.have.called;
    expect(spy.args[0][1].body).deep.equal('{"name":"Personal Loan","amount":"10000","period":"10"}');
  });

  it('_captureDetails() - doesnt makes a post request as amount is less than 10k', ()=>{
    const spy = Sinon.spy(window, 'fetch');
    el.shadowRoot.querySelector('.type').value = 'Personal Loan';
    el.shadowRoot.querySelector('.amount').value = '8000';
    el.shadowRoot.querySelector('.period').value = '10';
    el._captureDetails();
    expect([...el.shadowRoot.querySelector('.amount').classList].indexOf('e-handle')).to.not.equal(-1);
  });
});
