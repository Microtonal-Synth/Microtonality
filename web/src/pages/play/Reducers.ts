import {createMicrotonalConfig, MicrotonalConfig, ScaleConfig, SynthConfig} from "../../utility/MicrotonalConfig";
import OscillatorSettings from "../../utility/audio/OscillatorSettings";
import { Scale } from "../../utility/microtonal/Scale";
import { ScaleNote } from "../../utility/microtonal/notes";
import { parsePitchValue } from "../../utility/microtonal/scala/ScalaParser";



const setOscillator = (microtonalConfig: MicrotonalConfig, oscillator: OscillatorSettings, oscIndex: number) => {
    let newOscillators = [...microtonalConfig.synthConfig.oscillators];
    newOscillators[oscIndex] = oscillator;
    let synthConfig = {...microtonalConfig.synthConfig, oscillators: newOscillators} as SynthConfig;
    return createMicrotonalConfig(microtonalConfig, synthConfig, null);
}

const setAttack = (microtonalConfig: MicrotonalConfig, attack: number) => {
    let synthConfig = {...microtonalConfig.synthConfig, attack: attack} as SynthConfig;
    return createMicrotonalConfig(microtonalConfig, synthConfig, null);
}

const setDecay = (microtonalConfig: MicrotonalConfig, decay: number) => {
    let synthConfig = {...microtonalConfig.synthConfig, decay: decay} as SynthConfig;
    return createMicrotonalConfig(microtonalConfig, synthConfig, null);
}

const setSustain = (microtonalConfig: MicrotonalConfig, sustain: number) => {
    let synthConfig = {...microtonalConfig.synthConfig, sustain: sustain} as SynthConfig;
    return createMicrotonalConfig(microtonalConfig, synthConfig, null);
}

const setRelease = (microtonalConfig: MicrotonalConfig, release: number) => {
    let synthConfig = {...microtonalConfig.synthConfig, release: release} as SynthConfig;
    return createMicrotonalConfig(microtonalConfig, synthConfig, null);
}

const setGain = (microtonalConfig: MicrotonalConfig, gain: number) => {
    let synthConfig = {...microtonalConfig.synthConfig, gain: gain} as SynthConfig;
    return createMicrotonalConfig(microtonalConfig, synthConfig, null);
}

enum MCActions {
    SET_SCALE,
    ADD_NOTE,
    EDIT_NOTE,
    SWAP_NOTES,
    DELETE_NOTE,
    EDIT_OCTAVE_NOTE,
    SET_TUNING_FREQUENCY,
    SET_OSCILLATOR,
    SET_ATTACK,
    SET_DECAY,
    SET_SUSTAIN,
    SET_RELEASE,
    SET_MASTER_GAIN
}

type Action =
    | {type: MCActions.SET_SCALE, scale: Scale}
    | {type: MCActions.ADD_NOTE, note: ScaleNote}
    | {type: MCActions.EDIT_NOTE, noteValue: string, noteIndex: number}
    | {type: MCActions.SWAP_NOTES, currentIndex: number, newIndex: number}
    | {type: MCActions.DELETE_NOTE, noteIndex: number}
    | {type: MCActions.EDIT_OCTAVE_NOTE, noteValue: string}
    | {type: MCActions.SET_TUNING_FREQUENCY, tuningFrequency: number}
    | {type: MCActions.SET_OSCILLATOR, osc: OscillatorSettings, oscIndex: number}
    | {type: MCActions.SET_ATTACK, attack: number}
    | {type: MCActions.SET_DECAY, decay: number}
    | {type: MCActions.SET_SUSTAIN, sustain: number}
    | {type: MCActions.SET_RELEASE, release: number}
    | {type: MCActions.SET_MASTER_GAIN, gain: number}

const MicrotonalConfigReducer = (state: MicrotonalConfig, action: Action): MicrotonalConfig => {

    // Scale Changes
    if (action.type == MCActions.SET_SCALE) {
        let scaleConfig = {...state.scaleConfig, scale: action.scale, keysPerOctave: action.scale.notes.length} as ScaleConfig;
        return createMicrotonalConfig(state, null, scaleConfig);
    }
    // If some reducers share the same code,
    // put them together and filter out behavior as needed.
    if (action.type == MCActions.ADD_NOTE ||
        action.type == MCActions.EDIT_NOTE ||
        action.type == MCActions.SWAP_NOTES ||
        action.type == MCActions.DELETE_NOTE) {

        let notes: ScaleNote[] = state.scaleConfig.scale.notes;

        if (action.type == MCActions.ADD_NOTE) {
            notes = [...notes, action.note];
        }
        else if (action.type == MCActions.EDIT_NOTE) {
            let note: ScaleNote = parsePitchValue(`${action.noteValue} ${notes[action.noteIndex].comments}`);
            notes.splice(action.noteIndex, 1, note);
        }
        else if (action.type == MCActions.SWAP_NOTES) {
            let note: ScaleNote = notes[action.currentIndex];
            let swapWith: ScaleNote = notes[action.newIndex];

            notes.splice(action.newIndex, 1, note);
            notes.splice(action.currentIndex, 1, swapWith);
        }
        else if (action.type == MCActions.DELETE_NOTE) {
            notes.splice(action.noteIndex, 1);
        }

        let scale: Scale = new Scale(notes, state.scaleConfig.scale.title, state.scaleConfig.scale.description, state.scaleConfig.scale.octaveNote);
        let scaleConfig = {...state.scaleConfig, scale: scale, keysPerOctave: scale.notes.length} as ScaleConfig;
        return createMicrotonalConfig(state, null, scaleConfig);
    }
    if (action.type == MCActions.EDIT_OCTAVE_NOTE) {
        let octaveNote: ScaleNote = parsePitchValue(`${action.noteValue} ${state.scaleConfig.scale.octaveNote.comments}`);
        let scale = new Scale(state.scaleConfig.scale.notes, state.scaleConfig.scale.title, state.scaleConfig.scale.description, octaveNote);
        let scaleConfig = {...state.scaleConfig, scale: scale, keysPerOctave: scale.notes.length} as ScaleConfig;
        return createMicrotonalConfig(state, null, scaleConfig);
    }
    if (action.type == MCActions.SET_TUNING_FREQUENCY) {
        let scaleConfig = {...state.scaleConfig, tuningFrequency: action.tuningFrequency} as ScaleConfig;
        return createMicrotonalConfig(state, null, scaleConfig);
    }

    // Synthesizer Changes
    if (action.type == MCActions.SET_OSCILLATOR) {
        let newOscillators = [...state.synthConfig.oscillators];
        newOscillators[action.oscIndex] = action.osc;
        let synthConfig = {...state.synthConfig, oscillators: newOscillators} as SynthConfig;
        return createMicrotonalConfig(state, synthConfig, null);
    }
    if (action.type == MCActions.SET_ATTACK) {
        let synthConfig = {...state.synthConfig, attack: action.attack} as SynthConfig;
        return createMicrotonalConfig(state, synthConfig, null);
    }
    if (action.type == MCActions.SET_DECAY) {
        let synthConfig = {...state.synthConfig, decay: action.decay} as SynthConfig;
        return createMicrotonalConfig(state, synthConfig, null);
    }
    if (action.type == MCActions.SET_SUSTAIN) {
        let synthConfig = {...state.synthConfig, sustain: action.sustain} as SynthConfig;
        return createMicrotonalConfig(state, synthConfig, null);
    }
    if (action.type == MCActions.SET_RELEASE) {
        let synthConfig = {...state.synthConfig, release: action.release} as SynthConfig;
        return createMicrotonalConfig(state, synthConfig, null);
    }
    if (action.type == MCActions.SET_MASTER_GAIN) {
        let synthConfig = {...state.synthConfig, gain: action.gain} as SynthConfig;
        return createMicrotonalConfig(state, synthConfig, null);
    }
}

export {setOscillator, setAttack, setDecay, setSustain, setRelease, setGain, MicrotonalConfigReducer, MCActions}
