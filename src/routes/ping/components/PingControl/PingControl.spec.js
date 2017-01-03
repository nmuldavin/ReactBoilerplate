/* eslint no-unused-expressions: 0 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import PingControl from './PingControl';


describe('(Component) Counter', () => {
  let props;
  let spies;
  let wrapper;

  beforeEach(() => {
    spies = {};
    props = {
      isPinging: false,
      ...bindActionCreators(
        { ping: (spies.ping = sinon.spy()) },
        spies.dispatch = sinon.spy()
      ),
    };
    wrapper = shallow(<PingControl {...props} />);
  });

  it('Should render as a <div>.', () => {
    expect(wrapper.is('div')).to.equal(true);
  });

  it('Should render with an <h1> that tells you the ping state.', () => {
    expect(wrapper.find('h1').text()).to.match(/I am pinging:/);
  });

  it('Should tell you whether its pinging or not at the end of the <h1>.', () => {
    expect(wrapper.find('h1').text()).to.match(/No$/);
    wrapper.setProps({ isPinging: true });
    expect(wrapper.find('h1').text()).to.match(/Yes$/);
  });

  it('Should render a button.', () => {
    expect(wrapper.find('button')).to.have.length(1);
  });

  it('Should have a button that dispatches a `ping` action when clicked', () => {
    spies.ping.should.have.not.been.called;

    const button = wrapper.find('button');

    button.simulate('click');

    spies.ping.should.have.been.called;
  });
});
