import React from 'react';
import {mount, shallow} from 'enzyme';
import Prescriptions from "./Prescriptions";
import AddPrescriptionModal from "./AddPrescriptionModal";

jest.mock('NativeAnimatedHelper');

const navigation = {getParam: jest.fn()};
// const user = {uid: '123'};

describe('Prescriptions Component tests', () => {
  test('Prescriptions renders', () => {
    const wrapper = shallow(<Prescriptions navigation={navigation}/>);
    expect(wrapper).toHaveLength(1);
  });
  test('Prescriptions shallows with no items if no user', () => {
    const wrapper = shallow(<Prescriptions navigation={navigation}/>);
    expect(wrapper.find('prescriptionNoDataText'));
    expect(wrapper.find('addPrescriptionButton'));
  });
  test('AddPrescriptionModal renders correctly', () => {
    const wrapper = shallow(<AddPrescriptionModal navigation={navigation}/>);
    expect(wrapper.find('Formik'));
    expect(wrapper.find('addPrescriptionMedicineTextInput'));
    expect(wrapper.find('addPrescriptionDosageTextInput'));
    expect(wrapper.find('addPrescriptionTypeTextInput'));
    expect(wrapper.find('addPrescriptionUsageDurationTextInput'));
    expect(wrapper.find('addPrescriptionDoctorTextInput'));
    expect(wrapper.find('addPrescriptionProviderTextInput'));
    expect(wrapper.find('addPrescriptionProviderTextInput'));
    expect(wrapper.find('addPrescriptionCloseButton'));
  });
});
