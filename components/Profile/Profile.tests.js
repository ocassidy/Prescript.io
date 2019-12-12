import React from 'react';
import {mount, shallow} from 'enzyme';
import Profile from "./Profile";
import AddInfoModal from "./AddInfoModal";

jest.mock('NativeAnimatedHelper');

describe('Prescriptions Component tests', () => {
  test('Prescriptions renders', () => {
    const wrapper = shallow(<Profile/>);
    expect(wrapper).toHaveLength(1);
  });
  test('Prescriptions shallows with no items if no user', () => {
    const wrapper = shallow(<Profile navigation={navigation}/>);
    expect(wrapper.find('profileDisplayName'));
    expect(wrapper.find('profileHeaderText'));
    expect(wrapper.find('profileDetailText'));
    expect(wrapper.find('profileEmailText'));
    expect(wrapper.find('profileEmailVerifiedText'));
    expect(wrapper.find('profileVerifyEmailButton'));
    expect(wrapper.find('profileAddressText'));
    expect(wrapper.find('profilePhoneNumberText'));
    expect(wrapper.find('profileAddInfoButton'));
    expect(wrapper.find('profileChangePasswordButton'));
    expect(wrapper.find('profileLogoutButton'));
    expect(wrapper.find('profileDeleteAccountButton'));
  });
  test('AddInfoModal renders correctly', () => {
    const wrapper = shallow(<AddInfoModal navigation={navigation}/>);
    expect(wrapper.find('addInfoModalHeaderText'));
    expect(wrapper.find('Formik'));
    expect(wrapper.find('addInfoModalHeaderText'));
    expect(wrapper.find('addInfoAddressTextInput'));
    expect(wrapper.find('addInfoPhoneNumberTextInput'));
    expect(wrapper.find('addInfoSubmitButton'));
    expect(wrapper.find('addInfoCloseButton'));
  });
});
