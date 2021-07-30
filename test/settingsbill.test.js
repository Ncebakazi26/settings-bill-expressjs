const assert = require('assert');
const SettingsBill = require('../settingsbill');

describe('settings-bill', function(){

    const settingsBill = SettingsBill();

    it('should be able to record calls', function(){
        settingsBill.recordAction('call');
        assert.equal(1, settingsBill.actionsFor('call').length);
    });

    it('should be able to set the settings', function(){
        settingsBill.setSettings({
            smsCost: 0.75,
            callCost: 4,
            warningLevel: 10,
            criticalLevel: 20
        });

        assert.deepEqual({
            smsCost:0.75,
            callCost: 4,
            warningLevel: 10,
            criticalLevel: 20
        }, settingsBill.getSettings())


    });

    it('should calculate the right totals', function(){
        const settingsBill = SettingsBill();
        settingsBill.setSettings({
            smsCost: 0.35,
            callCost: 2.35,
            warningLevel: 20,
            criticalLevel: 40
        });

        settingsBill.recordAction('call');
        settingsBill.recordAction('sms');

        assert.equal(0.35, settingsBill.totals().smsTotal);
        assert.equal(2.35, settingsBill.totals().callTotal);
        assert.equal(2.70, settingsBill.totals().grandTotal);

    });

    it('should calculate the right totals for multiple actions', function(){
        const settingsBill = SettingsBill();
        settingsBill.setSettings({
            smsCost: 0.35,
            callCost: 2.35,
            warningLevel: 10,
            criticalLevel: 20
        });

        settingsBill.recordAction('call');
        settingsBill.recordAction('call');
        settingsBill.recordAction('call');
        settingsBill.recordAction('sms');
        settingsBill.recordAction('sms');
        settingsBill.recordAction('sms');

        assert.equal(1.05, settingsBill.totals().smsTotal);
        assert.equal(7.05, settingsBill.totals().callTotal);
        assert.equal(8.10, settingsBill.totals().grandTotal);

    });

    it('should know when warning level reached', function(){
        const settingsBill = SettingsBill();
        settingsBill.setSettings({
            smsCost: 2,
            callCost: 3,
            warningLevel: 5,
            criticalLevel: 10
        });

        settingsBill.recordAction('call');
        settingsBill.recordAction('sms');

        assert.equal(true, settingsBill.hasReachedWarningLevel());
    });

    it('should know when critical level reached', function(){
        const settingsBill = SettingsBill();
        settingsBill.setSettings({
            smsCost: 5,
            callCost: 5,
            warningLevel: 5,
            criticalLevel: 10
        });

        settingsBill.recordAction('call');
        settingsBill.recordAction('sms');

        assert.equal(true, settingsBill.hasReachedCriticalLevel());

    });
});