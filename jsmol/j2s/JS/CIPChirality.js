Clazz.declarePackage ("JS");
Clazz.load (["JU.BS", "$.Lst", "$.V3"], "JS.CIPChirality", ["java.util.Arrays", "$.Hashtable", "JU.Measure", "$.P4", "$.PT", "$.SB", "JU.BSUtil", "$.Elements", "$.Logger", "JV.JC"], function () {
c$ = Clazz.decorateAsClass (function () {
this.isRule4TEST = false;
this.ptID = 0;
this.root = null;
this.currentRule = 1;
this.lstSmallRings = null;
this.bsAtropisomeric = null;
this.bsKekuleAmbiguous = null;
this.bsAzacyclic = null;
this.vNorm = null;
this.vNorm2 = null;
this.vTemp = null;
this.rule1bOption = 1;
this.setAuxiliary = false;
if (!Clazz.isClassDefined ("JS.CIPChirality.CIPAtom")) {
JS.CIPChirality.$CIPChirality$CIPAtom$ ();
}
Clazz.instantialize (this, arguments);
}, JS, "CIPChirality");
Clazz.prepareFields (c$, function () {
this.lstSmallRings =  new JU.Lst ();
this.vNorm =  new JU.V3 ();
this.vNorm2 =  new JU.V3 ();
this.vTemp =  new JU.V3 ();
});
Clazz.defineMethod (c$, "getRuleName", 
function (rule) {
return JS.CIPChirality.ruleNames[rule];
}, "~N");
Clazz.makeConstructor (c$, 
function () {
System.out.println ("TESTING Rule 1b option " + this.rule1bOption);
});
Clazz.defineMethod (c$, "init", 
 function () {
this.ptID = 0;
this.lstSmallRings.clear ();
this.bsKekuleAmbiguous = null;
this.bsAtropisomeric =  new JU.BS ();
});
Clazz.defineMethod (c$, "getChiralityForAtoms", 
function (atoms, bsAtoms, bsAtropisomeric, bsHelixM, bsHelixP, setAuxiliary) {
if (bsAtoms.isEmpty ()) return;
this.init ();
this.setAuxiliary = (setAuxiliary && bsAtoms.cardinality () == 1);
this.bsAtropisomeric = (bsAtropisomeric == null ?  new JU.BS () : bsAtropisomeric);
var bs = JU.BSUtil.copy (bsAtoms);
this.lstSmallRings =  new JU.Lst ();
while (!bs.isEmpty ()) this.getSmallRings (atoms[bs.nextSetBit (0)], bs);

this.bsKekuleAmbiguous = this.getKekule (atoms);
this.bsAzacyclic = this.getAzacyclic (atoms, bsAtoms);
var bsToDo = JU.BSUtil.copy (bsAtoms);
var haveAlkenes = this.preFilterAtomList (atoms, bsToDo);
for (var i = bsToDo.nextSetBit (0); i >= 0; i = bsToDo.nextSetBit (i + 1)) {
var a = atoms[i];
a.setCIPChirality (0);
this.ptID = 0;
var c = this.getAtomChiralityLimited (a, null, null);
a.setCIPChirality (c == 0 ? 3 : c | ((this.currentRule - 1) << 5));
}
if (haveAlkenes) {
var lstEZ =  new JU.Lst ();
for (var i = bsToDo.nextSetBit (0); i >= 0; i = bsToDo.nextSetBit (i + 1)) this.getAtomBondChirality (atoms[i], lstEZ, bsToDo);

if (this.lstSmallRings.size () > 0 && lstEZ.size () > 0) this.clearSmallRingEZ (atoms, lstEZ);
if (bsHelixM != null) for (var i = bsHelixM.nextSetBit (0); i >= 0; i = bsHelixM.nextSetBit (i + 1)) atoms[i].setCIPChirality (17);

if (bsHelixP != null) for (var i = bsHelixP.nextSetBit (0); i >= 0; i = bsHelixP.nextSetBit (i + 1)) atoms[i].setCIPChirality (18);

}if (JU.Logger.debugging) {
JU.Logger.info ("sp2-aromatic = " + this.bsKekuleAmbiguous);
JU.Logger.info ("smallRings = " + JU.PT.toJSON (null, this.lstSmallRings));
}}, "~A,JU.BS,JU.BS,JU.BS,JU.BS,~B");
Clazz.defineMethod (c$, "getAzacyclic", 
 function (atoms, bsAtoms) {
var bsAza = null;
for (var i = bsAtoms.nextSetBit (0); i >= 0; i = bsAtoms.nextSetBit (i + 1)) {
var atom = atoms[i];
if (atom.getElementNumber () != 7 || atom.getCovalentBondCount () != 3 || this.bsKekuleAmbiguous.get (i)) continue;
var nRings =  new JU.Lst ();
for (var j = this.lstSmallRings.size (); --j >= 0; ) {
var bsRing = this.lstSmallRings.get (j);
if (bsRing.get (i)) nRings.addLast (bsRing);
}
var nr = nRings.size ();
if (nr < 2) continue;
var bsSubs =  new JU.BS ();
var bonds = atom.getEdges ();
for (var b = bonds.length; --b >= 0; ) if (bonds[b].isCovalent ()) bsSubs.set (bonds[b].getOtherNode (atom).getIndex ());

var bsBoth =  new JU.BS ();
var bsAll =  new JU.BS ();
for (var j = 0; j < nr - 1 && bsAll != null; j++) {
var bs1 = nRings.get (j);
for (var k = j + 1; k < nr && bsAll != null; k++) {
var bs2 = nRings.get (k);
JU.BSUtil.copy2 (bs1, bsBoth);
bsBoth.and (bs2);
if (bsBoth.cardinality () > 2) {
JU.BSUtil.copy2 (bs1, bsAll);
bsAll.or (bs2);
bsAll.and (bsSubs);
if (bsAll.cardinality () == 3) {
if (bsAza == null) bsAza =  new JU.BS ();
bsAza.set (i);
bsAll = null;
}}}
}
}
return bsAza;
}, "~A,JU.BS");
Clazz.defineMethod (c$, "preFilterAtomList", 
 function (atoms, bsToDo) {
var haveAlkenes = false;
for (var i = bsToDo.nextSetBit (0); i >= 0; i = bsToDo.nextSetBit (i + 1)) {
if (!this.couldBeChiralAtom (atoms[i])) {
bsToDo.clear (i);
continue;
}if (!haveAlkenes && this.couldBeChiralAlkene (atoms[i], null) != -1) haveAlkenes = true;
}
return haveAlkenes;
}, "~A,JU.BS");
Clazz.defineMethod (c$, "couldBeChiralAtom", 
 function (a) {
var mustBePlanar = false;
switch (a.getCovalentBondCount ()) {
default:
System.out.println ("?? too many bonds! " + a);
return false;
case 0:
return false;
case 1:
return false;
case 2:
return a.getElementNumber () == 7;
case 3:
switch (a.getElementNumber ()) {
case 7:
if (this.bsAzacyclic != null && this.bsAzacyclic.get (a.getIndex ())) break;
return false;
case 6:
mustBePlanar = true;
break;
case 15:
case 16:
case 33:
case 34:
case 51:
case 52:
case 83:
case 84:
break;
case 4:
break;
default:
return false;
}
break;
case 4:
break;
}
var edges = a.getEdges ();
var nH = 0;
var haveDouble = false;
for (var j = edges.length; --j >= 0; ) {
if (mustBePlanar && edges[j].getCovalentOrder () == 2) haveDouble = true;
if (edges[j].getOtherNode (a).getIsotopeNumber () == 1) nH++;
}
return (nH < 2 && (haveDouble || mustBePlanar == Math.abs (this.getTrigonality (a, this.vNorm)) < 0.2));
}, "JU.SimpleNode");
Clazz.defineMethod (c$, "couldBeChiralAlkene", 
 function (a, b) {
switch (a.getCovalentBondCount ()) {
default:
return -1;
case 2:
if (a.getElementNumber () != 7) return -1;
break;
case 3:
if (!this.isFirstRow (a)) return -1;
break;
}
var bonds = a.getEdges ();
var n = 0;
for (var i = bonds.length; --i >= 0; ) if (bonds[i].getCovalentOrder () == 2) {
if (++n > 1) return 17;
var other = bonds[i].getOtherNode (a);
if (!this.isFirstRow (other)) return -1;
if (b != null && (other !== b || b.getCovalentBondCount () == 1)) {
return -1;
}}
return 5;
}, "JU.SimpleNode,JU.SimpleNode");
Clazz.defineMethod (c$, "isFirstRow", 
function (a) {
var n = a.getElementNumber ();
return (n > 2 && n <= 10);
}, "JU.SimpleNode");
Clazz.defineMethod (c$, "getKekule", 
 function (atoms) {
var nRings = this.lstSmallRings.size ();
var bs =  new JU.BS ();
var bsDone =  new JU.BS ();
for (var i = nRings; --i >= 0; ) {
if (bsDone.get (i)) continue;
var bsRing = this.lstSmallRings.get (i);
if (bsRing.cardinality () != 6) {
bsDone.set (i);
continue;
}var nPI = 0;
for (var j = bsRing.nextSetBit (0); j >= 0; j = bsRing.nextSetBit (j + 1)) {
var a = atoms[j];
if (bs.get (a.getIndex ())) {
nPI++;
continue;
}var nb = a.getCovalentBondCount ();
if (nb == 3 || nb == 2) {
var bonds = a.getEdges ();
for (var k = bonds.length; --k >= 0; ) {
var b = bonds[k];
if (b.getCovalentOrder () != 2) continue;
if (bsRing.get (b.getOtherNode (a).getIndex ())) {
nPI++;
break;
}}
}}
if (nPI == 6) {
bs.or (bsRing);
bsDone.set (i);
i = nRings;
}}
return bs;
}, "~A");
Clazz.defineMethod (c$, "getSmallRings", 
 function (atom, bs) {
(this.root = Clazz.innerTypeInstance (JS.CIPChirality.CIPAtom, this, null).create (atom, null, false, false, false)).addSmallRings (bs);
}, "JU.SimpleNode,JU.BS");
Clazz.defineMethod (c$, "clearSmallRingEZ", 
 function (atoms, lstEZ) {
for (var j = this.lstSmallRings.size (); --j >= 0; ) this.lstSmallRings.get (j).andNot (this.bsAtropisomeric);

for (var i = lstEZ.size (); --i >= 0; ) {
var ab = lstEZ.get (i);
for (var j = this.lstSmallRings.size (); --j >= 0; ) {
var ring = this.lstSmallRings.get (j);
if (ring.get (ab[0]) && ring.get (ab[1])) {
atoms[ab[0]].setCIPChirality (3);
atoms[ab[1]].setCIPChirality (3);
}}
}
}, "~A,JU.Lst");
Clazz.defineMethod (c$, "getTrigonality", 
function (a, vNorm) {
var pts =  new Array (4);
var bonds = a.getEdges ();
for (var n = bonds.length, i = n, pt = 0; --i >= 0 && pt < 4; ) if (bonds[i].isCovalent ()) pts[pt++] = bonds[i].getOtherNode (a).getXYZ ();

var plane = JU.Measure.getPlaneThroughPoints (pts[0], pts[1], pts[2], vNorm, this.vTemp,  new JU.P4 ());
return JU.Measure.distanceToPlane (plane, (pts[3] == null ? a.getXYZ () : pts[3]));
}, "JU.SimpleNode,JU.V3");
Clazz.defineMethod (c$, "getAtomBondChirality", 
 function (atom, lstEZ, bsToDo) {
var index = atom.getIndex ();
var bonds = atom.getEdges ();
var c = 0;
var isAtropic = this.bsAtropisomeric.get (index);
for (var j = bonds.length; --j >= 0; ) {
var bond = bonds[j];
var atom1;
var index1;
if (isAtropic) {
atom1 = bonds[j].getOtherNode (atom);
index1 = atom1.getIndex ();
if (!this.bsAtropisomeric.get (index1)) continue;
c = this.setBondChirality (atom, atom1, atom, atom1, true);
} else if (bond.getCovalentOrder () == 2) {
atom1 = this.getLastCumuleneAtom (bond, atom, null, null);
index1 = atom1.getIndex ();
if (index1 < index) continue;
c = this.getBondChiralityLimited (bond, atom);
} else {
continue;
}if (c != 0) {
if (!isAtropic) lstEZ.addLast ( Clazz.newIntArray (-1, [index, index1]));
bsToDo.clear (index);
bsToDo.clear (index1);
}if (isAtropic) break;
}
}, "JU.SimpleNode,JU.Lst,JU.BS");
Clazz.defineMethod (c$, "getLastCumuleneAtom", 
 function (bond, atom, nSP2, parents) {
var atom2 = bond.getOtherNode (atom);
if (parents != null) {
parents[0] = atom2;
parents[1] = atom;
}if (nSP2 != null) nSP2[0] = 2;
var ppt = 0;
while (true) {
if (atom2.getCovalentBondCount () != 2) return atom2;
var edges = atom2.getEdges ();
for (var i = edges.length; --i >= 0; ) {
var atom3 = (bond = edges[i]).getOtherNode (atom2);
if (atom3 === atom) continue;
if (bond.getCovalentOrder () != 2) return atom2;
if (parents != null) {
if (ppt == 0) {
parents[0] = atom2;
ppt = 1;
}parents[1] = atom2;
}if (nSP2 != null) nSP2[0]++;
atom = atom2;
atom2 = atom3;
break;
}
}
}, "JU.SimpleEdge,JU.SimpleNode,~A,~A");
Clazz.defineMethod (c$, "getAtomChiralityLimited", 
 function (atom, cipAtom, parentAtom) {
var rs = 0;
try {
var isAlkeneEndCheck = (atom == null);
if (isAlkeneEndCheck) {
atom = (this.root = cipAtom).atom;
cipAtom.htPathPoints = (cipAtom.parent = Clazz.innerTypeInstance (JS.CIPChirality.CIPAtom, this, null).create (parentAtom, null, true, false, false)).htPathPoints;
} else {
if (!(this.root = cipAtom = Clazz.innerTypeInstance (JS.CIPChirality.CIPAtom, this, null).create (atom, null, false, false, false)).isSP3) {
return 0;
}}if (cipAtom.setNode ()) {
for (this.currentRule = 1; this.currentRule <= 9; this.currentRule++) {
if (JU.Logger.debugging) JU.Logger.info ("-Rule " + this.getRuleName (this.currentRule) + " CIPChirality for " + cipAtom + "-----");
switch (this.currentRule) {
case 4:
cipAtom.createAuxiliaryDescriptors (null, null);
break;
case 5:
if (cipAtom.rule4Type == 0) {
this.currentRule = 8;
continue;
}case 7:
cipAtom.sortSubstituents (-2147483648);
break;
case 9:
if (!cipAtom.setupRule6 (false)) continue;
break;
}
var nPrioritiesPrev = cipAtom.nPriorities;
if (cipAtom.sortSubstituents (0)) {
if (JU.Logger.debugging) {
JU.Logger.info (this.currentRule + ">>>>" + cipAtom);
for (var i = 0; i < cipAtom.bondCount; i++) {
if (cipAtom.atoms[i] != null) JU.Logger.info (cipAtom.atoms[i] + " " + cipAtom.priorities[i]);
}
}if (isAlkeneEndCheck) return (cipAtom.atoms[0].isDuplicate ? 2 : 1);
rs = cipAtom.checkHandedness ();
if (this.currentRule == 8 && (cipAtom.nPriorities != 4 || nPrioritiesPrev != 2)) {
rs |= 8;
}if (JU.Logger.debugging) JU.Logger.info (atom + " " + JV.JC.getCIPChiralityName (rs) + " by Rule " + this.getRuleName (this.currentRule) + "\n----------------------------------");
return rs;
}}
}} catch (e) {
System.out.println (e + " in CIPChirality " + this.currentRule);
{
alert(e);
}return 3;
}
return rs;
}, "JU.SimpleNode,JS.CIPChirality.CIPAtom,JU.SimpleNode");
Clazz.defineMethod (c$, "getBondChiralityLimited", 
 function (bond, a) {
if (JU.Logger.debugging) JU.Logger.info ("get Bond Chirality " + bond);
if (a == null) a = bond.getOtherNode (null);
if (this.couldBeChiralAlkene (a, bond.getOtherNode (a)) == -1) return 0;
var nSP2 =  Clazz.newIntArray (1, 0);
var parents =  new Array (2);
var b = this.getLastCumuleneAtom (bond, a, nSP2, parents);
var isAxial = nSP2[0] % 2 == 1;
return this.setBondChirality (a, parents[0], parents[1], b, isAxial);
}, "JU.SimpleEdge,JU.SimpleNode");
Clazz.defineMethod (c$, "setBondChirality", 
 function (a, pa, pb, b, isAxial) {
var a1 = Clazz.innerTypeInstance (JS.CIPChirality.CIPAtom, this, null).create (a, null, true, false, false);
var atop = this.getAtomChiralityLimited (null, a1, pa) - 1;
var ruleA = this.currentRule;
var b2 = Clazz.innerTypeInstance (JS.CIPChirality.CIPAtom, this, null).create (b, null, true, false, false);
var btop = this.getAtomChiralityLimited (null, b2, pb) - 1;
var ruleB = this.currentRule;
var c = (atop >= 0 && btop >= 0 ? this.getEneChirality (b2.atoms[btop], b2, a1, a1.atoms[atop], isAxial, true) : 0);
if (c != 0 && (isAxial || !this.bsAtropisomeric.get (a.getIndex ()) && !this.bsAtropisomeric.get (b.getIndex ()))) {
if (isAxial && ((ruleA == 8) != (ruleB == 8))) {
c |= 8;
}a.setCIPChirality (c | ((ruleA - 1) << 5));
b.setCIPChirality (c | ((ruleB - 1) << 5));
if (JU.Logger.debugging) JU.Logger.info (a + "-" + b + " " + JV.JC.getCIPChiralityName (c));
}return c;
}, "JU.SimpleNode,JU.SimpleNode,JU.SimpleNode,JU.SimpleNode,~B");
Clazz.defineMethod (c$, "getEneChirality", 
function (top1, end1, end2, top2, isAxial, allowPseudo) {
return (top1 == null || top2 == null || top1.atom == null || top2.atom == null ? 0 : isAxial ? (this.isPos (top1, end1, end2, top2) ? 18 : 17) : (this.isCis (top1, end1, end2, top2) ? 5 : 6));
}, "JS.CIPChirality.CIPAtom,JS.CIPChirality.CIPAtom,JS.CIPChirality.CIPAtom,JS.CIPChirality.CIPAtom,~B,~B");
Clazz.defineMethod (c$, "isCis", 
function (a, b, c, d) {
JU.Measure.getNormalThroughPoints (a.atom.getXYZ (), b.atom.getXYZ (), c.atom.getXYZ (), this.vNorm, this.vTemp);
var vNorm2 =  new JU.V3 ();
JU.Measure.getNormalThroughPoints (b.atom.getXYZ (), c.atom.getXYZ (), d.atom.getXYZ (), vNorm2, this.vTemp);
return (this.vNorm.dot (vNorm2) > 0);
}, "JS.CIPChirality.CIPAtom,JS.CIPChirality.CIPAtom,JS.CIPChirality.CIPAtom,JS.CIPChirality.CIPAtom");
Clazz.defineMethod (c$, "isPos", 
function (a, b, c, d) {
var angle = JU.Measure.computeTorsion (a.atom.getXYZ (), b.atom.getXYZ (), c.atom.getXYZ (), d.atom.getXYZ (), true);
return (angle > 0);
}, "JS.CIPChirality.CIPAtom,JS.CIPChirality.CIPAtom,JS.CIPChirality.CIPAtom,JS.CIPChirality.CIPAtom");
c$.$CIPChirality$CIPAtom$ = function () {
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.id = 0;
this.sphere = 0;
this.rootDistance = 0;
this.priority = 0;
this.isSet = false;
this.isDuplicate = true;
this.isTerminal = false;
this.isAlkene = false;
this.atom = null;
this.atomIndex = 0;
this.bondCount = 0;
this.elemNo = 0;
this.mass = -1;
this.parent = null;
this.rootSubstituent = null;
this.h1Count = 0;
this.atoms = null;
this.nAtoms = 0;
this.bsPath = null;
this.myPath = "";
this.priorities = null;
this.nPriorities = 0;
this.nRootDuplicates = 0;
this.htPathPoints = null;
this.alkeneParent = null;
this.alkeneChild = null;
this.isAlkeneAtom2 = false;
this.isKekuleAmbiguous = false;
this.nextSP2 = null;
this.multipleBondDuplicate = false;
this.isEvenEne = true;
this.auxEZ = -1;
this.isSP3 = true;
this.auxChirality = '~';
this.nextChiralBranch = null;
this.rule4Count = null;
this.rule4List = null;
this.rootRule4Paths = null;
this.priorityPath = null;
this.rule4Type = 0;
this.bsTemp = null;
this.reverseRule2 = false;
this.rule6refIndex = -1;
Clazz.instantialize (this, arguments);
}, JS.CIPChirality, "CIPAtom", null, [Comparable, Cloneable]);
Clazz.prepareFields (c$, function () {
this.atoms =  new Array (4);
this.priorities =  Clazz.newIntArray (4, 0);
this.bsTemp =  new JU.BS ();
});
Clazz.makeConstructor (c$, 
function () {
});
Clazz.defineMethod (c$, "setupRule6", 
function (a) {
if (this.nPriorities > 2 || (a ? this.countDuplicates (this.atomIndex) : this.nRootDuplicates) <= 2) return false;
this.b$["JS.CIPChirality"].root.rule6refIndex = this.atoms[this.priorities[2]].atomIndex;
this.sortSubstituents (-2147483648);
return true;
}, "~B");
Clazz.defineMethod (c$, "countDuplicates", 
 function (a) {
var b = 0;
for (var c = 0; c < 4; c++) {
if (this.atoms[c] == null) continue;
if (this.atoms[c].isDuplicate) {
if (this.atoms[c].atomIndex == a) b++;
} else {
b += this.atoms[c].countDuplicates (a);
}}
return b;
}, "~N");
Clazz.defineMethod (c$, "create", 
function (a, b, c, d, e) {
this.id = ++this.b$["JS.CIPChirality"].ptID;
this.parent = b;
if (a == null) return this;
this.isAlkene = c;
this.atom = a;
this.atomIndex = a.getIndex ();
this.isKekuleAmbiguous = (this.b$["JS.CIPChirality"].bsKekuleAmbiguous != null && this.b$["JS.CIPChirality"].bsKekuleAmbiguous.get (this.atomIndex));
this.elemNo = (d && this.isKekuleAmbiguous ? b.getKekuleElementNumber () : a.getElementNumber ());
this.bondCount = a.getCovalentBondCount ();
this.isSP3 = (this.bondCount == 4 || this.bondCount == 3 && !c && (this.elemNo > 10 || this.b$["JS.CIPChirality"].bsAzacyclic != null && this.b$["JS.CIPChirality"].bsAzacyclic.get (this.atomIndex)));
if (b != null) this.sphere = b.sphere + 1;
if (this.sphere == 1) {
this.rootSubstituent = this;
this.htPathPoints =  new java.util.Hashtable ();
} else if (b != null) {
this.rootSubstituent = b.rootSubstituent;
this.htPathPoints = (b.htPathPoints).clone ();
}this.bsPath = (b == null ?  new JU.BS () : JU.BSUtil.copy (b.bsPath));
this.multipleBondDuplicate = d;
this.rootDistance = this.sphere;
if (b == null) {
this.bsPath.set (this.atomIndex);
} else if (this.multipleBondDuplicate && (this.b$["JS.CIPChirality"].rule1bOption == 4 && this.isKekuleAmbiguous || this.b$["JS.CIPChirality"].rule1bOption == 2)) {
} else if (this.multipleBondDuplicate && this.b$["JS.CIPChirality"].rule1bOption == 1) {
this.rootDistance--;
} else if (a === this.b$["JS.CIPChirality"].root.atom) {
d = true;
this.rootDistance = 0;
this.b$["JS.CIPChirality"].root.nRootDuplicates++;
} else if (this.bsPath.get (this.atomIndex)) {
d = true;
this.rootDistance = (e ? b.sphere : this.htPathPoints.get (Integer.$valueOf (this.atomIndex)).intValue ());
} else {
this.bsPath.set (this.atomIndex);
this.htPathPoints.put (Integer.$valueOf (this.atomIndex), Integer.$valueOf (this.rootDistance));
}this.isDuplicate = d;
if (JU.Logger.debuggingHigh) {
if (this.sphere < 50) this.myPath = (b != null ? b.myPath + "-" : "") + this;
JU.Logger.info ("new CIPAtom " + this.myPath);
}return this;
}, "JU.SimpleNode,JS.CIPChirality.CIPAtom,~B,~B,~B");
Clazz.defineMethod (c$, "getMass", 
 function () {
if (this.mass == -1 && (this.mass = this.atom.getMass ()) == Clazz.floatToInt (this.mass)) {
if (this.isType (";4He;16O;52Cr;96Mo;175Lu;")) this.reverseRule2 = true;
 else if (this.elemNo > 92 || this.isType (";9Be;19F;23Na;27Al;31P;45Sc;55Mn;59Co;75As;89Y;93Nb;98Tc;103Rh;127I;133Cs;141Pr;145Pm;159Tb;165Ho;169Tm;197Au;209Bi;209Po;210At;222Rn;223Fr;226Ra;227Ac;231Pa;232Th;and all > U (atomno > 92)")) this.mass = JU.Elements.getAtomicMass (Clazz.floatToInt (this.elemNo));
}return this.mass;
});
Clazz.defineMethod (c$, "isType", 
 function (a) {
return JU.PT.isOneOf (Clazz.floatToInt (this.mass) + JU.Elements.elementSymbolFromNumber (Clazz.floatToInt (this.elemNo)), a);
}, "~S");
Clazz.defineMethod (c$, "getKekuleElementNumber", 
 function () {
var a = this.atom.getEdges ();
var b;
var c = 0;
var d = 0;
for (var e = a.length; --e >= 0; ) if ((b = a[e]).isCovalent ()) {
var f = b.getOtherNode (this.atom);
if (this.b$["JS.CIPChirality"].bsKekuleAmbiguous.get (f.getIndex ())) {
d++;
c += f.getElementNumber ();
}}
return c / d;
});
Clazz.defineMethod (c$, "updateRingList", 
function () {
var a = JU.BSUtil.newAndSetBit (this.atomIndex);
var b = this;
var c = -1;
while ((b = b.parent) != null && c != this.atomIndex) a.set (c = b.atomIndex);

if (a.cardinality () <= 7) {
for (var d = this.b$["JS.CIPChirality"].lstSmallRings.size (); --d >= 0; ) if (this.b$["JS.CIPChirality"].lstSmallRings.get (d).equals (a)) return;

this.b$["JS.CIPChirality"].lstSmallRings.addLast (a);
}});
Clazz.defineMethod (c$, "setNode", 
function () {
if (this.isSet || (this.isSet = true) && this.isDuplicate) return true;
var a = this.atom.getEdges ();
var b = a.length;
if (JU.Logger.debuggingHigh) JU.Logger.info ("set " + this);
var c = 0;
for (var d = 0; d < b; d++) {
var e = a[d];
if (!e.isCovalent ()) continue;
var f = e.getOtherNode (this.atom);
var g = (this.parent != null && this.parent.atom === f);
var h = e.getCovalentOrder ();
if (h == 2) {
if (this.elemNo > 10 || !this.b$["JS.CIPChirality"].isFirstRow (f)) h = 1;
 else {
this.isAlkene = true;
if (g) this.setEne ();
}}if (b == 1 && h == 1 && g) return this.isTerminal = true;
switch (h) {
case 3:
if (this.addAtom (c++, f, g, false, g) == null) return !(this.isTerminal = true);
case 2:
if (this.addAtom (c++, f, h != 2 || g, h == 2, g) == null) return !(this.isTerminal = true);
case 1:
if (g || this.addAtom (c++, f, h != 1 && this.elemNo <= 10, false, false) != null) break;
default:
return !(this.isTerminal = true);
}
}
this.nAtoms = c;
for (; c < this.atoms.length; c++) this.atoms[c] = Clazz.innerTypeInstance (JS.CIPChirality.CIPAtom, this, null).create (null, this, false, true, false);

java.util.Arrays.sort (this.atoms);
return true;
});
Clazz.defineMethod (c$, "setEne", 
 function () {
this.parent.alkeneChild = null;
this.alkeneParent = (this.parent.alkeneParent == null ? this.parent : this.parent.alkeneParent);
this.alkeneParent.alkeneChild = this;
this.nextSP2 = this.parent;
if (this.parent.alkeneParent == null) this.parent.nextSP2 = this;
if (this.atom.getCovalentBondCount () == 2 && this.atom.getValence () == 4) {
this.parent.isAlkeneAtom2 = false;
this.alkeneParent.isEvenEne = !this.alkeneParent.isEvenEne;
} else {
this.isAlkeneAtom2 = true;
}});
Clazz.defineMethod (c$, "addAtom", 
function (a, b, c, d, e) {
if (a >= this.atoms.length) {
if (JU.Logger.debugging) JU.Logger.info (" too many bonds on " + this.atom);
return null;
}if (this.parent == null) {
if (b.getIsotopeNumber () == 1) {
if (++this.h1Count > 1) {
if (JU.Logger.debuggingHigh) JU.Logger.info (" second H atom found on " + this.atom);
return null;
}}}return this.atoms[a] = Clazz.innerTypeInstance (JS.CIPChirality.CIPAtom, this, null).create (b, this, d, c, e);
}, "~N,JU.SimpleNode,~B,~B,~B");
Clazz.defineMethod (c$, "sortSubstituents", 
function (a) {
if (this.nPriorities == (a < 1 ? 4 : 3)) return true;
var b = (a == -2147483648);
if (b) {
if (this.isTerminal) return false;
if (this.b$["JS.CIPChirality"].currentRule == 9) {
for (var c = 0; c < 4; c++) if (this.atoms[c] != null && !this.atoms[c].isDuplicate && this.atoms[c].atom != null && this.atoms[c].setNode ()) this.atoms[c].sortSubstituents (-2147483648);

} else {
for (var c = 0; c < 4; c++) if (this.rule4List[c] != null && this.atoms[c].atom != null && !this.atoms[c].isTerminal) this.atoms[c].sortSubstituents (-2147483648);

if (!this.isSP3) return false;
}}b = new Boolean (b | (this.b$["JS.CIPChirality"].currentRule == 6 || this.b$["JS.CIPChirality"].currentRule == 8)).valueOf ();
var c =  Clazz.newIntArray (4, 0);
var d =  Clazz.newIntArray (4, 0);
for (var e = 0; e < 4; e++) {
d[e] = this.priorities[e];
this.priorities[e] = 0;
}
if (JU.Logger.debuggingHigh) {
JU.Logger.info (this.b$["JS.CIPChirality"].root + "---sortSubstituents---" + this);
for (var f = 0; f < 4; f++) {
JU.Logger.info (this.b$["JS.CIPChirality"].getRuleName (this.b$["JS.CIPChirality"].currentRule) + ": " + this + "[" + f + "]=" + this.atoms[f].myPath + " " + Integer.toHexString (d[f]));
}
JU.Logger.info ("---" + this.nPriorities);
}var f;
var g;
for (var h = 0; h < 4; h++) {
var i = this.atoms[h];
for (var j = h + 1; j < 4; j++) {
var k = this.atoms[f = j];
switch (i.atom == null ? 1 : k.atom == null ? -1 : d[h] < d[j] ? -1 : d[j] < d[h] ? 1 : (g = this.checkPriority (i, k, h, j)) != 0 ? g : b ? -2147483648 : this.sign (i.breakTie (k, a + 1))) {
case 1:
f = h;
case -1:
this.priorities[f]++;
break;
case 0:
case -2147483648:
break;
}
c[f]++;
}
}
var i =  new Array (4);
var j =  Clazz.newIntArray (4, 0);
var k = (this.rule4List == null ? null :  new Array (4));
this.bsTemp.clearAll ();
for (var l = 0; l < 4; l++) {
var m = c[l];
var n = i[m] = this.atoms[l];
j[m] = this.priorities[l];
if (this.rule4List != null) k[m] = this.rule4List[l];
if (n.atom != null) this.bsTemp.set (this.priorities[l]);
}
this.atoms = i;
this.priorities = j;
this.rule4List = k;
this.nPriorities = this.bsTemp.cardinality ();
if (JU.Logger.debuggingHigh && this.atoms[2].atom != null && this.atoms[2].elemNo != 1) {
JU.Logger.info (this.dots () + this.atom + " nPriorities = " + this.nPriorities);
for (var m = 0; m < 4; m++) {
JU.Logger.info (this.dots () + this.myPath + "[" + m + "]=" + this.atoms[m] + " " + this.priorities[m] + " " + Integer.toHexString (this.priorities[m]));
}
JU.Logger.info (this.dots () + "-------" + this.nPriorities);
}return (this.nPriorities == this.bondCount);
}, "~N");
Clazz.defineMethod (c$, "dots", 
 function () {
return ".....................".substring (0, Math.min (20, this.sphere));
});
Clazz.defineMethod (c$, "breakTie", 
 function (a, b) {
if (this.isDuplicate && a.isDuplicate && this.atom === a.atom && this.rootDistance == a.rootDistance) return 0;
var c = this.checkIsDuplicate (a);
if (c != 0) return c * (b + 1);
if (!this.setNode () || !a.setNode () || this.isTerminal && a.isTerminal || this.isDuplicate && a.isDuplicate) return 0;
if (this.isTerminal != a.isTerminal) return (this.isTerminal ? 1 : -1) * (b + 1);
if ((c = this.compareShallowly (a, b)) != 0) {
return c;
}this.sortSubstituents (b);
a.sortSubstituents (b);
var d = (this.nAtoms == 0 ? 1 : 0);
var e = 2147483647;
for (var f = 0; f < this.nAtoms; f++) {
var g = this.atoms[f];
var h = a.atoms[f];
if ((c = g.breakTie (h, b + 1)) != 0) {
var i = Math.abs (c);
if (i < e) {
e = i;
d = c;
}}}
return d;
}, "JS.CIPChirality.CIPAtom,~N");
Clazz.defineMethod (c$, "compareShallowly", 
 function (a, b) {
for (var c = 0; c < this.nAtoms; c++) {
var d = this.atoms[c];
var e = a.atoms[c];
var f = d.checkCurrentRule (e);
if (f != -2147483648 && f != 0) return f * (b + 1);
}
return 0;
}, "JS.CIPChirality.CIPAtom,~N");
Clazz.overrideMethod (c$, "compareTo", 
function (a) {
var b;
return (a == null ? -1 : (this.atom == null) != (a.atom == null) ? (this.atom == null ? 1 : -1) : (b = this.checkRule1a (a)) != 0 ? b : (b = this.checkIsDuplicate (a)) != 0 ? b : this.isDuplicate && (b = this.checkRule1b (a)) != 0 ? b : this.checkRule2 (a));
}, "JS.CIPChirality.CIPAtom");
Clazz.defineMethod (c$, "checkPriority", 
 function (a, b, c, d) {
switch (this.b$["JS.CIPChirality"].currentRule) {
case 6:
case 8:
return (this.rule4List[c] == null && this.rule4List[d] == null ? -2147483648 : this.rule4List[d] == null ? -1 : this.rule4List[c] == null ? 1 : this.compareMataPair (a, b));
}
var e;
return ((a.atom == null) != (b.atom == null) ? (a.atom == null ? 1 : -1) : (e = a.checkCurrentRule (b)) == -2147483648 ? 0 : e);
}, "JS.CIPChirality.CIPAtom,JS.CIPChirality.CIPAtom,~N,~N");
Clazz.defineMethod (c$, "checkIsDuplicate", 
 function (a) {
return a.isDuplicate == this.isDuplicate ? 0 : a.isDuplicate ? -1 : 1;
}, "JS.CIPChirality.CIPAtom");
Clazz.defineMethod (c$, "sortByRule", 
 function (a) {
var b = this.b$["JS.CIPChirality"].currentRule;
this.b$["JS.CIPChirality"].currentRule = a;
var c = this.b$["JS.CIPChirality"].root.rule6refIndex;
if (c != -1) System.out.println ("?????");
if (a == 9) this.setupRule6 (true);
var d = this.sortSubstituents (0);
this.b$["JS.CIPChirality"].root.rule6refIndex = c;
this.b$["JS.CIPChirality"].currentRule = b;
return d;
}, "~N");
Clazz.defineMethod (c$, "checkCurrentRule", 
 function (a) {
switch (this.b$["JS.CIPChirality"].currentRule) {
default:
case 1:
return this.checkRule1a (a);
case 2:
return this.checkRule1b (a);
case 3:
return this.checkRule2 (a);
case 4:
return this.checkRule3 (a);
case 5:
return this.checkRules4ac (a, " sr SR PM");
case 7:
return this.checkRules4ac (a, " s r p m");
case 6:
case 8:
return 0;
case 9:
return this.checkRule6 (a);
}
}, "JS.CIPChirality.CIPAtom");
Clazz.defineMethod (c$, "checkRule6", 
 function (a) {
return ((this.atomIndex == this.b$["JS.CIPChirality"].root.rule6refIndex) == (a.atomIndex == this.b$["JS.CIPChirality"].root.rule6refIndex) ? 0 : this.atomIndex == this.b$["JS.CIPChirality"].root.rule6refIndex ? -1 : 1);
}, "JS.CIPChirality.CIPAtom");
Clazz.defineMethod (c$, "checkRule1a", 
 function (a) {
return a.atom == null ? -1 : this.atom == null ? 1 : a.elemNo < this.elemNo ? -1 : a.elemNo > this.elemNo ? 1 : 0;
}, "JS.CIPChirality.CIPAtom");
Clazz.defineMethod (c$, "checkRule1b", 
 function (a) {
return a.isDuplicate != this.isDuplicate ? 0 : this.b$["JS.CIPChirality"].rule1bOption == 3 && (this.parent.isAlkene || a.parent.isAlkene) ? 0 : a.rootDistance != this.rootDistance ? (a.rootDistance > this.rootDistance ? -1 : 1) : 0;
}, "JS.CIPChirality.CIPAtom");
Clazz.defineMethod (c$, "checkRule2", 
 function (a) {
return (a.getMass () == this.getMass () ? 0 : (this.reverseRule2 || a.reverseRule2) == (a.mass > this.mass) ? -1 : 1);
}, "JS.CIPChirality.CIPAtom");
Clazz.defineMethod (c$, "checkRule3", 
 function (a) {
return this.isDuplicate || a.isDuplicate || !this.parent.isAlkeneAtom2 || !a.parent.isAlkeneAtom2 || !this.parent.alkeneParent.isEvenEne || !a.parent.alkeneParent.isEvenEne || this.parent === a.parent ? 0 : this.parent.auxEZ < a.parent.auxEZ ? -1 : this.parent.auxEZ > a.parent.auxEZ ? 1 : 0;
}, "JS.CIPChirality.CIPAtom");
Clazz.defineMethod (c$, "getAuxEneWinnerChirality", 
 function (a, b, c, d) {
var e = this.getAuxEneEndWinner (a, a.nextSP2, null);
var f = (e == null || e.atom == null ? null : this.getAuxEneEndWinner (b, b.nextSP2, d));
return this.b$["JS.CIPChirality"].getEneChirality (e, a, b, f, c, false);
}, "JS.CIPChirality.CIPAtom,JS.CIPChirality.CIPAtom,~B,~A");
Clazz.defineMethod (c$, "getAuxEneEndWinner", 
 function (a, b, c) {
var d = a.clone ();
if (d.parent !== b) d.addReturnPath (b, a);
d.rule4List = a.rule4List;
var e;
for (var f = 1; f <= 9; f++) {
if (d.sortByRule (f)) {
for (var g = 0; g < 4; g++) {
e = d.atoms[g];
if (!e.multipleBondDuplicate) {
if (d.priorities[g] != d.priorities[g + 1]) {
if (c != null) c[0] = f;
return (e.atom == null ? null : e);
}}}
}}
return null;
}, "JS.CIPChirality.CIPAtom,JS.CIPChirality.CIPAtom,~A");
Clazz.defineMethod (c$, "addReturnPath", 
 function (a, b) {
var c =  new JU.Lst ();
var d = this;
var e;
var f = b;
var g = a;
while (f.parent != null && f.parent.atoms[0] != null) {
if (JU.Logger.debuggingHigh) JU.Logger.info ("path:" + f.parent + "->" + f);
c.addLast (f = f.parent);
}
c.addLast (null);
for (var h = 0, i = c.size (); h < i; h++) {
f = c.get (h);
e = (f == null ? Clazz.innerTypeInstance (JS.CIPChirality.CIPAtom, this, null).create (null, this, this.isAlkene, true, false) : f.clone ());
e.sphere = d.sphere + 1;
d.replaceParentSubstituent (g, a, e);
if (h > 0 && d.isAlkene && !d.isAlkeneAtom2) {
if (a.isAlkeneAtom2) {
a.isAlkeneAtom2 = false;
d.alkeneParent = a;
}d.setEne ();
}a = d;
d = e;
g = b;
b = f;
}
}, "JS.CIPChirality.CIPAtom,JS.CIPChirality.CIPAtom");
Clazz.defineMethod (c$, "replaceParentSubstituent", 
 function (a, b, c) {
for (var d = 0; d < 4; d++) if (this.atoms[d] === a || b == null && this.atoms[d].atom == null) {
if (JU.Logger.debuggingHigh) JU.Logger.info ("reversed: " + b + "->" + this + "->" + c);
this.parent = b;
this.atoms[d] = c;
java.util.Arrays.sort (this.atoms);
break;
}
}, "JS.CIPChirality.CIPAtom,JS.CIPChirality.CIPAtom,JS.CIPChirality.CIPAtom");
Clazz.defineMethod (c$, "compareMataPair", 
 function (a, b) {
a.generateRule4Paths (this);
b.generateRule4Paths (this);
var c = (this.b$["JS.CIPChirality"].currentRule == 8);
var d = (c ? 'R' : a.getRule4ReferenceDescriptor ());
var e = (c ? 'R' : b.getRule4ReferenceDescriptor ());
var f = (d == '?');
if (JU.Logger.debugging) JU.Logger.info ("reference descriptors are " + d + " and " + e);
var g = 0;
var h = "Rule 4b";
while (true) {
if (d == '-' && e == '-') return -2147483648;
if ((d == '?') != (e == '?')) {
g = (f ? 1 : -1);
h += " RS on only one side";
break;
}var i = (f ? a.flattenRule4Paths ('R') : a.flattenRule4Paths (d));
var j = (f ? a.flattenRule4Paths ('S') : "");
var k = (f ? b.flattenRule4Paths ('R') : b.flattenRule4Paths (e));
var l = (f ? b.flattenRule4Paths ('S') : "");
if (c) {
g = this.sign (f ? (i + j).compareTo (k + l) : i.compareTo (k));
h = "Rule 5";
break;
}i = this.cleanRule4Str (i);
k = this.cleanRule4Str (k);
if (f) {
if (this.compareRule4PairStr (i, j = this.cleanRule4Str (j), true) > 0) i = j;
if (this.compareRule4PairStr (k, l = this.cleanRule4Str (l), true) > 0) k = l;
}g = this.compareRule4PairStr (i, k, false);
break;
}
if (JU.Logger.debugging && (g == -1 || g == 1)) JU.Logger.info ((g == -1 ? a : b) + " > " + (g == -1 ? b : a) + " by " + h + "\n");
return (g == 0 ? -2147483648 : g);
}, "JS.CIPChirality.CIPAtom,JS.CIPChirality.CIPAtom");
Clazz.defineMethod (c$, "generateRule4Paths", 
function (a) {
this.getRule4PriorityPaths ("", a.atom);
this.rootRule4Paths =  new JU.Lst ();
this.appendRule4Paths (this,  new Array (3));
this.getRule4Counts (this.rule4Count =  Clazz.newArray (-1, [null, JS.CIPChirality.zero, JS.CIPChirality.zero, Integer.$valueOf (10000)]));
if (JU.Logger.debugging) {
JU.Logger.info ("Rule 4b paths for " + this + "=\n");
for (var b = 0; b < this.rootRule4Paths.size (); b++) {
var c = this.rootRule4Paths.get (b)[0].toString ();
var d = this.rootRule4Paths.get (b)[1].length;
while (JS.CIPChirality.prefixString.length < d) JS.CIPChirality.prefixString += JS.CIPChirality.prefixString;

JU.Logger.info (JS.CIPChirality.prefixString.substring (0, d) + c.substring (d) + " " + this.priorityPath);
}
JU.Logger.info ("");
}}, "JS.CIPChirality.CIPAtom");
Clazz.defineMethod (c$, "getRule4PriorityPaths", 
 function (a, b) {
this.priorityPath = a + (this.priority + 1);
for (var c = 0; c < 4; c++) if (this.rule4List[c] != null && this.atoms[c].atom !== b) this.atoms[c].getRule4PriorityPaths (this.priorityPath, null);

}, "~S,JU.SimpleNode");
Clazz.defineMethod (c$, "getRule4Counts", 
 function (a) {
if (this.sphere > (a[3]).intValue ()) return;
if (this.rule4Type > 0) {
var b = this.sign (this.priorityPath.length - (a[0] == null ? 10000 : (a[0]).length));
if (b == 0) b = this.sign (this.priorityPath.compareTo (a[0].toString ()));
switch (b) {
case -1:
a[0] = this.priorityPath;
a[1] = a[2] = JS.CIPChirality.zero;
a[3] = Integer.$valueOf (this.sphere);
case 0:
a[this.rule4Type] = Integer.$valueOf ((a[this.rule4Type]).intValue () + 1);
break;
}
if (JU.Logger.debugging) JU.Logger.info (this + " addRule4Ref " + this.sphere + " " + this.priority + " " + this.rule4Type + " " + JU.PT.toJSON ("rule4Count", a));
}for (var b = 0; b < 4; b++) if (this.rule4List[b] != null) this.atoms[b].getRule4Counts (a);

}, "~A");
Clazz.defineMethod (c$, "appendRule4Paths", 
 function (a, b) {
var c = (b[0] == null ? "" + this.auxChirality : b[0]);
if (b[2] == null) a.rootRule4Paths.addLast (b =  Clazz.newArray (-1, [c, "", this.priorityPath]));
var d = true;
for (var e = 0; e < 4; e++) if (this.rule4List[e] != null) {
if (d) b[2] = this.priorityPath;
 else a.rootRule4Paths.addLast (b =  Clazz.newArray (-1, [c, c, this.priorityPath]));
d = false;
b[0] += this.rule4List[e];
if (this.atoms[e].nextChiralBranch != null) this.atoms[e].nextChiralBranch.appendRule4Paths (a, b);
}
}, "JS.CIPChirality.CIPAtom,~A");
Clazz.defineMethod (c$, "getRule4ReferenceDescriptor", 
 function () {
if (this.rule4Count == null) return this.auxChirality;
var a = (this.rule4Count[1]).intValue ();
var b = (this.rule4Count[2]).intValue ();
return (a > b ? 'R' : a < b ? 'S' : a == 0 ? '-' : '?');
});
Clazz.defineMethod (c$, "flattenRule4Paths", 
 function (a) {
var b = this.rootRule4Paths.size ();
var c =  new Array (b);
var d = 0;
for (var e = 0; e < b; e++) {
var f = this.rootRule4Paths.get (e)[0];
var g = this.rootRule4Paths.get (e)[2];
var h = JU.PT.replaceAllCharacters (f, "srctmp", "~");
c[e] = h = g + h.$replace (a, 'A');
if (h.length > d) d = h.length;
}
java.util.Arrays.sort (c);
for (var f = 0; f < b; f++) {
c[f] = JU.PT.replaceAllCharacters (c[f], "1234", "").$replace ('A', a);
if (JU.Logger.debugging) JU.Logger.info ("Flattened[" + f + "]=" + c[f]);
}
var g =  new JU.SB ();
var h;
for (var i = 0; i < d; i++) {
for (var j = 0; j < b; j++) {
h = c[j];
g.append (i < h.length ? h.substring (i, i + 1) : "~");
}
}
return g.toString ();
}, "~S");
Clazz.defineMethod (c$, "cleanRule4Str", 
 function (a) {
return (a.length > 1 ? JU.PT.replaceAllCharacters (a, "rsmpct~", "") : a);
}, "~S");
Clazz.defineMethod (c$, "compareRule4PairStr", 
 function (a, b, c) {
var d = a.length;
if (d == 0 || d != b.length) return 0;
if (JU.Logger.debugging) JU.Logger.info (this.dots () + this.myPath + " Rule 4b comparing " + a + " " + b);
var e = a.charAt (0);
var f = b.charAt (0);
for (var g = 1; g < d; g++) {
var h = (e == a.charAt (g));
if (h != (f == b.charAt (g))) return (c ? g : 1) * (h ? -1 : 1);
}
return (c ? 0 : -2147483648);
}, "~S,~S,~B");
Clazz.defineMethod (c$, "createAuxiliaryDescriptors", 
function (a, b) {
var c = "";
var d = '~';
if (this.atom == null) return "" + d;
this.rule4List =  new Array (4);
this.setNode ();
var e = -1;
var f = 0;
var g =  new Array (1);
var h = false;
var i = true;
var j = (!this.isAlkene && this.nPriorities == (a == null ? 2 : 1));
for (var k = 0; k < 4; k++) {
var l = this.atoms[k];
if (l != null && !l.isDuplicate && !l.isTerminal) {
l.priority = this.priorities[k];
g[0] = null;
var m = l.createAuxiliaryDescriptors (a == null ? l : a, g);
if (g[0] != null) {
l.nextChiralBranch = g[0];
if (b != null) b[0] = g[0];
}this.rule4List[k] = m;
if (l.nextChiralBranch != null || m.indexOf ("R") >= 0 || m.indexOf ("S") >= 0 || m.indexOf ("r") >= 0 || m.indexOf ("s") >= 0) {
f++;
c = m;
i = true;
} else {
if (!j && !i && this.priorities[k] == this.priorities[k - 1]) {
if (a == null) {
for (; k >= 0; --k) this.rule4List[k] = null;

}return "~";
}i = false;
}}}
var l = (f >= 2);
switch (f) {
case 0:
c = "";
case 1:
h = true;
break;
case 2:
case 3:
case 4:
d = '~';
c = "";
if (b != null) b[0] = this;
break;
}
if (this.isAlkene) {
if (this.alkeneChild != null) {
if (!this.isEvenEne || (this.auxEZ == 7 || this.auxEZ == -1) && !this.isKekuleAmbiguous && this.alkeneChild.bondCount >= 2) {
var m = (this.isEvenEne ?  Clazz.newIntArray (1, 0) : null);
e = this.getAuxEneWinnerChirality (this, this.alkeneChild, !this.isEvenEne, m);
if (e == 0) {
this.auxEZ = this.alkeneChild.auxEZ = 7;
} else {
if (m != null && m[0] != 8) {
this.auxEZ = this.alkeneChild.auxEZ = e;
} else if (!l) {
switch (e) {
case 17:
case 5:
e = 1;
d = 'R';
break;
case 18:
case 6:
e = 2;
d = 'S';
break;
}
this.auxChirality = d;
this.rule4Type = e;
c = "";
if (b != null && b[0] === this.alkeneChild) {
this.nextChiralBranch = this.alkeneChild;
b[0] = this;
}}}}}} else if (this.isSP3) {
var m = this.clone ();
if (m.setNode ()) {
m.addReturnPath (null, this);
m.rule4List =  new Array (4);
for (var n = 0; n < 4; n++) {
for (var o = 0; o < 4; o++) {
if (m.atoms[n] === this.atoms[o]) {
m.rule4List[n] = this.rule4List[o];
break;
}}
}
var o = 1;
for (; o <= 9; o++) if ((!h || o < 5 || o > 8) && m.sortByRule (o)) break;

if (o > 9) {
d = '~';
} else {
e = m.checkHandedness ();
d = (e == 1 ? 'R' : e == 2 ? 'S' : '~');
if (o == 8) {
d = (d == 'R' ? 'r' : d == 'S' ? 's' : '~');
} else {
this.rule4Type = e;
}}}this.auxChirality = d;
}if (this.b$["JS.CIPChirality"].setAuxiliary && this.auxChirality != '~') this.atom.setCIPChirality (JV.JC.getCIPChiralityCode (this.auxChirality));
if (a == null) this.rule4Type = f;
c = d + c;
if (JU.Logger.debugging && !c.equals ("~")) JU.Logger.info ("creating aux " + d + " for " + this + " = " + this.myPath);
return c;
}, "JS.CIPChirality.CIPAtom,~A");
Clazz.defineMethod (c$, "checkRules4ac", 
 function (a, b) {
if (this.isTerminal || this.isDuplicate) return 0;
var c = b.indexOf (this.auxChirality);
var d = b.indexOf (a.auxChirality);
return (c > d + 1 ? -1 : d > c + 1 ? 1 : 0);
}, "JS.CIPChirality.CIPAtom,~S");
Clazz.defineMethod (c$, "checkHandedness", 
function () {
var a = this.atoms[0].atom.getXYZ ();
var b = this.atoms[1].atom.getXYZ ();
var c = this.atoms[2].atom.getXYZ ();
JU.Measure.getNormalThroughPoints (a, b, c, this.b$["JS.CIPChirality"].vNorm, this.b$["JS.CIPChirality"].vTemp);
this.b$["JS.CIPChirality"].vTemp.setT ((this.atoms[3].atom == null ? this.atom : this.atoms[3].atom).getXYZ ());
this.b$["JS.CIPChirality"].vTemp.sub (a);
return (this.b$["JS.CIPChirality"].vTemp.dot (this.b$["JS.CIPChirality"].vNorm) > 0 ? 1 : 2);
});
Clazz.defineMethod (c$, "sign", 
function (a) {
return (a < 0 ? -1 : a > 0 ? 1 : 0);
}, "~N");
Clazz.defineMethod (c$, "addSmallRings", 
function (a) {
if (this.atom == null || this.sphere > 7) return;
if (a != null) a.clear (this.atom.getIndex ());
if (this.isTerminal || this.isDuplicate || this.atom.getCovalentBondCount () > 4) return;
var b;
var c = 0;
var d = this.atom.getEdges ();
for (var e = d.length; --e >= 0; ) {
var f = d[e];
if (!f.isCovalent () || (b = f.getOtherNode (this.atom)).getCovalentBondCount () == 1 || this.parent != null && b === this.parent.atom) continue;
var g = this.addAtom (c++, b, false, false, false);
if (g.isDuplicate) g.updateRingList ();
}
for (var f = 0; f < c; f++) if (this.atoms[f] != null) this.atoms[f].addSmallRings (a);

}, "JU.BS");
Clazz.defineMethod (c$, "clone", 
function () {
var a = null;
try {
a = Clazz.superCall (this, JS.CIPChirality.CIPAtom, "clone", []);
} catch (e) {
if (Clazz.exceptionOf (e, CloneNotSupportedException)) {
} else {
throw e;
}
}
a.id = this.b$["JS.CIPChirality"].ptID++;
a.atoms =  new Array (4);
a.priorities =  Clazz.newIntArray (4, 0);
a.htPathPoints = this.htPathPoints;
a.alkeneParent = null;
a.rule4Count = null;
a.rule4List = null;
a.rootRule4Paths = null;
a.auxEZ = -1;
a.priority = 0;
for (var b = 0; b < 4; b++) if (this.atoms[b] != null) a.atoms[b] = this.atoms[b];

return a;
});
Clazz.defineMethod (c$, "toString", 
function () {
return (this.atom == null ? "<null>" : "[" + this.b$["JS.CIPChirality"].currentRule + "." + this.sphere + "." + this.priority + "," + this.id + "." + this.atom.getAtomName () + (this.isDuplicate ? "*(" + this.rootDistance + ")" : "") + (this.auxChirality == '~' ? "" : "" + this.auxChirality) + "]");
});
c$ = Clazz.p0p ();
};
Clazz.defineStatics (c$,
"RULE_2_nXX_EQ_XX", ";9Be;19F;23Na;27Al;31P;45Sc;55Mn;59Co;75As;89Y;93Nb;98Tc;103Rh;127I;133Cs;141Pr;145Pm;159Tb;165Ho;169Tm;197Au;209Bi;209Po;210At;222Rn;223Fr;226Ra;227Ac;231Pa;232Th;and all > U (atomno > 92)",
"RULE_2_nXX_REV_XX", ";4He;16O;52Cr;96Mo;175Lu;",
"NO_CHIRALITY", 0,
"TIED", 0,
"A_WINS", -1,
"B_WINS", 1,
"DIASTEREOMERIC", -3,
"DIASTEREOMERIC_A_WINS", -2,
"DIASTEREOMERIC_B_WINS", 2,
"ENANTIOMERIC_A_WINS", -3,
"ENANTIOMERIC_B_WINS", 3,
"IGNORE", -2147483648,
"UNDETERMINED", -1,
"STEREO_R", 1,
"STEREO_S", 2,
"STEREO_M", 17,
"STEREO_P", 18,
"STEREO_Z", 5,
"STEREO_E", 6,
"STEREO_BOTH_RS", 3,
"STEREO_BOTH_EZ", 7,
"RULE_1a", 1,
"RULE_1b", 2,
"RULE_2", 3,
"RULE_3", 4,
"RULE_4a", 5,
"RULE_4b", 6,
"RULE_4c", 7,
"RULE_5", 8,
"RULE_6", 9,
"prefixString", "..........");
c$.zero = c$.prototype.zero = Integer.$valueOf (0);
Clazz.defineStatics (c$,
"ruleNames",  Clazz.newArray (-1, ["", "1a", "1b", "2", "3", "4a", "4b", "4c", "5", "6"]),
"TRIGONALITY_MIN", 0.2,
"MAX_PATH", 50,
"SMALL_RING_MAX", 7,
"RULE_1b_TEST_OPTION_0_UNCHANGED", 0,
"RULE_1b_TEST_OPTION_A_PARENT", 1,
"RULE_1b_TEST_OPTION_B_SELF", 2,
"RULE_1b_TEST_OPTION_C_NONE", 3,
"RULE_1b_TEST_OPTION_D_SELF_KEKULE", 4);
});
