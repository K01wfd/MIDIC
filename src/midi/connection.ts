class tritonMIDI extends EventTarget {
  private access: MIDIAccess | null;
  private output: MIDIOutput | null;
  private input: MIDIInput | null;
  execCounter = 0;
  constructor() {
    super();
    this.access = null;
    this.output = null;
    this.input = null;
    this.#initConnection();
  }

  changePatchNumber(channel: number, progNumber: number) {
    if (!this.output) return;
    this.output.send([0xc0 | channel, progNumber]);
  }

  sendMessage(data: number[]) {
    if (!this.output) throw new Error('Error sending data, no output');
    this.output.send(data);
  }

  async #initConnection() {
    try {
      this.access = await navigator.requestMIDIAccess({ sysex: true });
      if (!this.access) {
        throw new Error('No MIDI Interface connected');
      }
      // Collect outputs
      this.access.outputs.forEach((output) => {
        this.output = output;
      });

      // Collect inputs and add listeners
      this.access.inputs.forEach((input) => {
        this.input = input;
        input.onmidimessage = (msg) => this.#handleMIDIMessage(msg);
      });
      alert('✅ MIDI IS SUPPORTED ✅');
      // Notify when ready
      this.dispatchEvent(new CustomEvent('ready'));
    } catch (err) {
      alert('MIDI NOT SUPPORTED 🚫');
      console.error('❌ Error accessing MIDI:', err);
    }
  }

  #handleMIDIMessage(message: MIDIMessageEvent) {
    if (!message.data) return;
    const data = Array.from(message.data);

    if (data[0] === 0xfe || data[0] === 0xf8) return;
    this.dispatchEvent(new CustomEvent('newMessage', { detail: data }));
  }
}

export const trMIDI = new tritonMIDI();
