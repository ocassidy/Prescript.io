import React from 'react';
import {mount, shallow} from 'enzyme';
import Login from "./Login";
jest.mock('NativeAnimatedHelper');

describe('Login Component tests, no user logged in', () => {
  test('Login renders', () => {
    const wrapper = shallow(<Login/>);
    wrapper.update();
    expect(wrapper).toHaveLength(1);
  });
  test('Login shallows with all fields and buttons', () => {
    const wrapper = shallow(<Login/>);
    wrapper.update();
    expect(wrapper.find('Formik'));
    expect(wrapper.find('loginEmailInput'));
    expect(wrapper.find('loginPasswordInput'));
    expect(wrapper.find('loginSubmitButton'));
    expect(wrapper.find('navigateRegisterButton'));
    expect(wrapper.find('navigateResetPasswordButton'));
  });
});
