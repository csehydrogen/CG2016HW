module.exports = {};

const hull = {n : 44};
hull.position = [-1,0.45,-0.3,1.2,0.45,-0.3,-1.12,0.45,0,1.4,0.45,0,-1.2,0.6,0.1999999,1.2,0.6,0.1999999,-1.12,0.75,0,1.4,0.75,0,1.5,0.45,-0.1,-1,-0.45,-0.3,1.2,-0.45,-0.3,-1.2,0,0.1999999,-1,0,-0.3,1.2,0,0.1999999,1.2,0,-0.3,-1.12,-0.45,0,1.4,-0.45,0,-1.2,-0.6,0.1999999,1.2,-0.6,0.1999999,-1.12,-0.75,0,1.4,-0.75,0,1.5,0,-0.1,1.5,-0.45,-0.1,-1.12,0,0];
hull.normal = [0,0,-1,-0.9284771,0,-0.3713899,0,1,0,0,0.7999999,0.6000002,0,0,1,0.7071068,0,0.7071068,0.5547003,0,-0.8320503,-0.9284767,0,-0.3713907,-0.928477,0,-0.3713899,0,-1,0,0,-0.7999998,0.6000002,0.707107,0,0.7071067,-0.928477,0,-0.3713899,0,0.8000001,0.5999999,0.7071067,0,0.7071069,0.7071068,0,0.7071068,0.5547003,0,-0.8320502,0,-0.8000001,0.6];
hull.index = [2,0,7,0,3,0,0,0,14,0,12,0,4,1,2,1,11,1,3,2,1,2,2,2,5,3,6,3,4,3,5,4,11,4,13,4,21,5,3,5,13,5,21,6,1,6,8,6,2,7,12,7,23,7,20,0,15,0,16,0,14,0,9,0,12,0,23,8,15,8,11,8,10,9,22,9,16,9,19,10,18,10,17,10,11,4,18,4,13,4,18,11,16,11,13,11,10,6,21,6,22,6,12,7,15,7,23,7,2,0,6,0,7,0,0,0,1,0,14,0,23,8,11,8,2,8,4,12,6,12,2,12,0,2,2,2,1,2,3,2,8,2,1,2,5,13,7,13,6,13,5,4,4,4,11,4,5,11,13,11,3,11,21,14,8,14,3,14,3,15,7,15,5,15,21,16,14,16,1,16,2,7,0,7,12,7,20,0,19,0,15,0,14,0,10,0,9,0,17,1,11,1,15,1,15,12,19,12,17,12,16,9,15,9,10,9,9,9,10,9,15,9,19,17,20,17,18,17,11,4,17,4,18,4,21,5,13,5,16,5,18,15,20,15,16,15,16,14,22,14,21,14,10,16,14,16,21,16,12,7,9,7,15,7];
module.exports.hull = hull;

const turret = {n : 44};
turret.position = [-0.55,0.23,0.3000003,0,0.4499999,0,0,0.3799999,0.2999989,0.6,0.3,0,0.6,0.23,0.3000003,0,0.4499999,0.1,-0.6,0.3,0.1,-0.3,0.2268802,0,-0.3,0.2268802,0.1,-0.6,0,0.1,-0.55,-0.23,0.3000003,0,-0.4499999,0,0,-0.3799999,0.2999989,0.6,-0.3,0,0.6,-0.23,0.3000003,-0.55,0,0.3000003,0.6,0,0.3000003,0.6,0,0,0,-0.4499999,0.1,-0.6,-0.3,0.1,-0.3,0,0,-0.3,0,0.1,-0.3,-0.2268802,0,-0.3,-0.2268802,0.1];
turret.normal = [-0.2251743,0.9006978,0.3715374,2.47371e-6,0,1,0.2708185,0.9374492,0.218738,1,0,0,0,0,-1,-0.9701427,0,0.2425354,-1,0,0,0,0,-1,-0.5967766,0.8024076,0,-0.2492881,-0.9140595,0.3199229,0,-3.4508e-6,1,0.2296566,-0.9186301,0.3215226,-0.5967766,-0.8024076,0,-0.2492881,0.9140595,0.3199229,0,3.4508e-6,1,-2.15959e-6,0,1,0.2425355,0.9701426,0,0.2296566,0.9186301,0.3215226,-0.9701427,0,0.2425354,-0.2251743,-0.9006978,0.3715374,2.41481e-6,0,1,0.2425355,-0.9701426,0,0.2708185,-0.9374492,0.218738];
turret.index = [0,0,5,0,6,0,2,1,0,1,15,1,5,2,4,2,3,2,4,3,17,3,3,3,1,4,3,4,17,4,9,5,0,5,6,5,8,6,20,6,21,6,6,7,8,7,9,7,8,8,1,8,7,8,10,9,18,9,12,9,15,10,12,10,16,10,14,11,12,11,18,11,14,3,17,3,16,3,17,4,11,4,20,4,10,5,9,5,19,5,20,6,23,6,21,6,21,4,23,4,9,4,11,12,23,12,22,12,0,13,2,13,5,13,15,14,16,14,2,14,4,15,2,15,16,15,3,16,1,16,5,16,5,17,2,17,4,17,4,3,16,3,17,3,17,4,20,4,1,4,7,4,1,4,20,4,9,18,15,18,0,18,8,6,7,6,20,6,21,4,9,4,8,4,6,4,5,4,8,4,8,8,5,8,1,8,10,19,19,19,18,19,14,15,16,15,12,15,15,20,10,20,12,20,18,21,11,21,13,21,13,22,14,22,18,22,14,3,13,3,17,3,22,4,20,4,11,4,17,4,13,4,11,4,10,18,15,18,9,18,20,6,22,6,23,6,19,7,9,7,23,7,23,4,18,4,19,4,11,12,18,12,23,12];
module.exports.turret = turret;

const gun = {n : 316};
gun.position = [0.5786089,0.04709404,0,2.58077,0.04709404,0,0.5786089,0.04618918,-0.009187638,2.58077,0.04618918,-0.0091874,0.5786089,0.0435093,-0.01802211,2.58077,0.0435093,-0.01802211,0.5786089,0.03915733,-0.02616387,2.58077,0.03915733,-0.02616387,0.5786089,0.03330057,-0.03330057,2.58077,0.03330057,-0.03330057,0.5786089,0.02616405,-0.03915733,2.58077,0.02616405,-0.03915709,0.5786089,0.01802217,-0.04350918,2.58077,0.01802217,-0.04350918,0.5786089,0.009187638,-0.04618924,2.58077,0.009187638,-0.04618889,0.5786089,0,-0.04709416,2.58077,0,-0.04709392,0.5786089,-0.009187579,-0.04618924,2.58077,-0.009187579,-0.04618889,0.5786089,-0.01802206,-0.04350918,2.58077,-0.01802206,-0.04350918,0.5786089,-0.02616399,-0.03915733,2.58077,-0.02616399,-0.03915709,0.5786089,-0.03330045,-0.03330057,2.58077,-0.03330045,-0.03330057,0.5786089,-0.03915727,-0.02616387,2.58077,-0.03915727,-0.02616387,0.5786089,-0.04350918,-0.01802211,2.58077,-0.04350918,-0.01802211,0.5786089,-0.04618912,-0.009187638,2.58077,-0.04618912,-0.0091874,0.5786089,-0.04709398,0,2.58077,-0.04709398,0,0.5786089,-0.04618912,0.009187459,2.58077,-0.04618912,0.009187698,0.5786089,-0.04350918,0.01802206,2.58077,-0.04350918,0.01802206,0.5786089,-0.03915727,0.02616405,2.58077,-0.03915727,0.02616405,0.5786089,-0.03330045,0.03330063,2.58077,-0.03330045,0.03330063,0.5786089,-0.02616399,0.03915739,2.58077,-0.02616399,0.03915739,0.5786089,-0.01802206,0.04350936,2.58077,-0.01802206,0.04350936,0.5786089,-0.009187459,0.04618918,2.58077,-0.009187459,0.04618918,0.5786089,0,0.04709386,2.58077,0,0.04709422,0.5786089,0.009187638,0.04618918,2.58077,0.009187638,0.04618918,0.5786089,0.01802217,0.04350936,2.58077,0.01802217,0.04350936,0.5786089,0.02616417,0.03915703,2.58077,0.02616417,0.03915739,0.5786089,0.03330063,0.03330028,2.58077,0.03330063,0.03330063,0.5786089,0.03915733,0.02616405,2.58077,0.03915733,0.02616405,0.5786089,0.0435093,0.01802206,2.58077,0.0435093,0.01802206,0.5786089,0.04618918,0.009187459,2.58077,0.04618918,0.009187459,0.573203,0.06327086,0,0.573203,0.06205517,-0.01234364,0.573203,0.05845469,-0.02421277,0.573203,0.05260783,-0.03515118,0.573203,0.0447393,-0.04473936,0.573203,0.03515142,-0.05260789,0.573203,0.02421277,-0.05845463,0.573203,0.01234358,-0.06205528,0.573203,0,-0.06327104,0.573203,-0.01234352,-0.06205528,0.573203,-0.02421265,-0.05845463,0.573203,-0.03515136,-0.05260789,0.573203,-0.04473918,-0.04473936,0.573203,-0.05260777,-0.03515118,0.573203,-0.05845457,-0.02421277,0.573203,-0.06205511,-0.01234364,0.573203,-0.0632708,0,0.573203,-0.06205511,0.01234334,0.573203,-0.05845457,0.02421265,0.573203,-0.05260777,0.03515142,0.573203,-0.04473918,0.04473942,0.573203,-0.03515136,0.05260795,0.573203,-0.02421265,0.05845481,0.573203,-0.0123434,0.06205517,0.573203,0,0.06327062,0.573203,0.01234358,0.06205517,0.573203,0.02421277,0.05845481,0.573203,0.03515154,0.05260747,0.573203,0.04473942,0.04473894,0.573203,0.05260783,0.03515142,0.573203,0.05845469,0.02421265,0.573203,0.06205517,0.01234334,0.2970465,0.06327086,0,0.2970465,0.06205517,-0.01234364,0.2970465,0.05845469,-0.02421277,0.2970465,0.05260783,-0.03515118,0.2970465,0.0447393,-0.04473936,0.2970465,0.03515142,-0.05260789,0.2970465,0.02421277,-0.05845463,0.2970465,0.01234358,-0.06205528,0.2970465,0,-0.06327104,0.2970465,-0.01234352,-0.06205528,0.2970465,-0.02421265,-0.05845463,0.2970465,-0.03515136,-0.05260789,0.2970465,-0.04473918,-0.04473936,0.2970465,-0.05260777,-0.03515118,0.2970465,-0.05845457,-0.02421277,0.2970465,-0.06205511,-0.01234364,0.2970465,-0.0632708,0,0.2970465,-0.06205511,0.01234334,0.2970465,-0.05845457,0.02421265,0.2970465,-0.05260777,0.03515142,0.2970465,-0.04473918,0.04473942,0.2970465,-0.03515136,0.05260795,0.2970465,-0.02421265,0.05845481,0.2970465,-0.0123434,0.06205517,0.2970465,0,0.06327062,0.2970465,0.01234358,0.06205517,0.2970465,0.02421277,0.05845481,0.2970465,0.03515154,0.05260747,0.2970465,0.04473942,0.04473894,0.2970465,0.05260783,0.03515142,0.2970465,0.05845469,0.02421265,0.2970465,0.06205517,0.01234334,-0.01081854,0.1139151,0,-0.01081854,0.1117264,-0.02222388,-0.01081854,0.1052439,-0.04359346,-0.01081854,0.09471702,-0.06328749,-0.01081854,0.08055025,-0.08055031,-0.01081854,0.06328785,-0.09471714,-0.01081854,0.04359352,-0.1052438,-0.01081854,0.02222383,-0.1117265,-0.01081854,0,-0.1139155,-0.01081854,-0.02222383,-0.1117265,-0.01081854,-0.04359334,-0.1052438,-0.01081854,-0.06328785,-0.09471714,-0.01081854,-0.08055013,-0.08055031,-0.01081854,-0.09471702,-0.06328749,-0.01081854,-0.1052438,-0.04359346,-0.01081854,-0.1117263,-0.02222388,-0.01081854,-0.1139151,0,-0.01081854,-0.1117263,0.02222347,-0.01081854,-0.1052438,0.04359334,-0.01081854,-0.09471702,0.06328791,-0.01081854,-0.08055013,0.08055049,-0.01081854,-0.06328785,0.09471732,-0.01081854,-0.04359334,0.1052442,-0.01081854,-0.02222353,0.1117264,-0.01081854,0,0.1139147,-0.01081854,0.02222383,0.1117264,-0.01081854,0.04359352,0.1052442,-0.01081854,0.06328803,0.09471642,-0.01081854,0.08055043,0.08054965,-0.01081854,0.09471702,0.06328791,-0.01081854,0.1052439,0.04359334,-0.01081854,0.1117264,0.02222347];
gun.normal = [0,0.9951853,-0.09801226,0,0.9569402,-0.2902853,0,0.8819159,-0.4714069,0,0.7730218,-0.6343795,0,0.6343905,-0.7730128,0,0.4713896,-0.8819252,0,0.2902989,-0.9569361,1.79497e-7,0.09801894,-0.9951846,0,-0.09801834,-0.9951846,1.732e-7,-0.2903007,-0.9569356,0,-0.4713869,-0.8819266,0,-0.6343938,-0.7730101,0,-0.7730191,-0.6343829,0,-0.881919,-0.4714013,0,-0.9569391,-0.2902889,0,-0.9951852,-0.09801304,0,-0.9951848,0.09801638,0,-0.95694,0.2902861,0,-0.8819243,0.4713911,0,-0.7730135,0.6343896,0,-0.6343937,0.7730103,0,-0.471397,0.8819212,0,-0.2902735,0.9569438,0,-0.09799402,0.995187,-1.79497e-7,0.09799337,0.9951871,0,0.2902753,0.9569433,0,0.4714257,0.8819059,-1.3541e-7,0.6343922,0.7730115,0,0.7730047,0.6344004,0,0.881922,0.4713955,1,0,0,0,0.9569416,0.2902809,0,0.9951851,0.09801399,0.9479809,0.09241801,-0.3046165,0,-0.9569402,0.2902852,0.9479821,-0.316791,-0.03120005,0.9479813,0.03119826,0.3167935,0.9479823,0.2807337,-0.1500608,0.947982,-0.2019422,-0.2460686,0.9479814,-0.2019445,0.2460683,0.9479823,0.2807357,0.1500571,0.9479818,0.03119808,-0.3167921,0.9479824,-0.3167901,0.03120088,0.9479824,0.09239494,0.3046189,0.9479819,0.2460711,-0.2019394,0.9479814,-0.246072,-0.2019402,0.9479821,-0.1500559,0.2807372,0.9479826,0.3046156,0.09240406,0.947982,-0.03119701,-0.3167917,0.9479826,-0.3046151,0.09240531,0.9479817,0.1500657,0.2807331,0.947982,0.2019411,-0.2460693,0.9479802,-0.2807419,-0.1500589,0.9479819,-0.09239965,0.3046189,0.9479796,0.3167985,-0.03119927,0.9479809,0.3167946,0.03120058,0.9479814,-0.09241127,-0.3046169,0.9479824,-0.2807358,0.1500557,0.947981,0.201945,0.2460697,0.9479815,0.1500551,-0.2807391,0.9479818,-0.3046171,-0.09240645,0.9479815,-0.03119319,0.3167933,0.9479814,0.304619,-0.09240508,0.947982,-0.1500512,-0.2807397,0.9479798,-0.2460771,0.2019414,0.9479809,0.2460696,0.2019459,0.1615592,-0.62606,0.7628549,0,0.6343906,-0.7730126,0,0.995185,0.09801483,0,-0.8819242,0.4713913,0,0.4713895,-0.8819251,0,-0.7730139,0.6343892,0,0.2902989,-0.9569361,0,-0.6343941,0.7730099,0,0.09801918,-0.9951846,0,-0.4713971,0.8819211,0,-0.09801858,-0.9951846,0,-0.2902734,0.9569438,0,-0.2903007,-0.9569355,0,-0.09799391,0.9951871,0,-0.471387,-0.8819265,0,0.09799325,0.9951871,0,-0.6343935,-0.7730103,0,0.2902752,0.9569432,0,-0.7730189,-0.6343831,0,0.4714261,0.8819057,0,-0.8819189,-0.4714013,0,0.9951854,-0.09801125,0,0.6343922,0.7730113,0,-0.9569388,-0.2902898,0,0.9569403,-0.2902848,0,0.7730048,0.6344003,0,-0.9951851,-0.0980134,0,0.8819162,-0.4714064,0,0.8819217,0.4713959,0,-0.9951848,0.0980159,0,0.7730221,-0.6343792,0,0.9569414,0.2902813,-1,0,0,0.1615592,0.09673154,-0.9821109,0.1615595,-0.4652046,0.8703352,0.1615591,-0.09673094,-0.9821109,0.1615591,-0.2864603,0.9443725,0.1615589,-0.2864871,-0.9443643,0.1615588,-0.09670603,0.9821134,0.1615588,-0.4651945,-0.8703407,0.1615586,0.09670609,0.9821134,0.1615589,-0.6260597,-0.7628551,0.1615592,0.2864619,0.9443719,0.1615586,-0.7628636,-0.6260495,0.1615588,0.4652329,0.8703202,0.1615586,-0.8703329,-0.4652091,0.1615587,0.9821116,-0.09672421,0.1615584,0.6260582,0.7628566,0.1615588,-0.9443678,-0.2864758,0.1615588,0.9443688,-0.2864722,0.1615586,0.762849,0.6260674,0.1615589,-0.9821116,-0.09672498,0.1615587,0.8703305,-0.4652136,0.1615589,0.8703363,0.4652028,0.1615588,-0.9821112,0.09672856,0.1615587,0.7628672,-0.6260451,0.1615588,0.9443703,0.2864674,0.1615588,-0.9443687,0.2864728,0.1615589,0.6260566,-0.7628577,0.1615587,0.9821115,0.09672641,0.1615588,-0.8703386,0.4651985,0.1615588,0.4651969,-0.8703393,0.1615593,-0.7628595,0.6260544,0.1615589,0.2864852,-0.9443649,0,0.9951851,-0.09801393,0,0.9569426,-0.2902773,0,0.8819162,-0.4714061,0,0.7730222,-0.634379,0,0.6343752,-0.7730253,0,0.4714097,-0.8819144,1.70051e-7,0.2902634,-0.9569469,0,0.09803175,-0.9951833,1.79496e-7,-0.0980311,-0.9951834,0,-0.2902652,-0.9569463,0,-0.471407,-0.8819158,0,-0.6343783,-0.7730228,0,-0.7730187,-0.6343833,0,-0.8819186,-0.4714018,0,-0.956941,-0.2902824,0,-0.9951848,-0.09801632,0,-0.9951851,0.09801304,0,-0.956938,0.2902926,0,-0.8819247,0.4713905,0,-0.7730138,0.6343892,0,-0.6343939,0.7730101,0,-0.2902734,0.9569438,-1.76349e-7,-0.09803235,0.9951833,0,0.09803175,0.9951833,0,0.2902752,0.9569433,-1.57453e-7,0.4713956,0.8819219,-1.38559e-7,0.6343921,0.7730114,0,0.7730199,0.634382,0,0.8819217,0.4713961,1,-1.54264e-4,0,1,-2.24043e-4,0,1,2.24062e-4,0,1,-5.60202e-5,0,1,1.89117e-5,0,1,-2.24074e-4,0,1,7.71305e-5,0,1,1.92836e-5,0,1,1.51288e-4,0,0,0.9569413,0.2902816,0,0.995185,0.09801477,0.9479814,0.09241068,-0.304617,0,-0.9569399,0.2902863,0.9479797,-0.3167982,-0.03119999,0.9479816,0.03119295,0.3167933,0.9479802,0.2807411,-0.1500604,0.9479814,-0.2019447,-0.2460685,0.9479822,-0.2019416,0.246068,0.9479825,0.2807351,0.1500571,0.9479819,0.03119724,-0.3167918,0.9479809,-0.3167943,0.03120082,0.947982,0.09240013,0.3046185,0.9479814,0.246073,-0.2019391,0.947982,-0.24607,-0.2019404,0.9479819,-0.1500573,0.280737,0.9479821,0.3046171,0.09240406,0.9479819,-0.0311979,-0.316792,0.9479812,-0.3046193,0.09240531,0.947981,0.1500709,0.2807328,0.9479814,0.2019438,-0.2460694,0.9479823,-0.2807344,-0.1500592,0.9479823,-0.09239435,0.3046191,0.947982,0.3167913,-0.03119981,0.9479824,0.3167904,0.03120017,0.9479808,-0.09241861,-0.3046163,0.9479823,-0.2807365,0.1500557,0.9479816,0.2019422,0.2460696,0.947982,0.1500522,-0.2807393,0.9479815,-0.3046183,-0.09240627,0.9479814,-0.03119844,0.3167935,0.9479827,0.3046148,-0.0924052,0.9479816,-0.1500542,-0.2807396,0.9479816,-0.2460696,0.2019419,0.9479817,0.2460663,0.2019461,0.1615591,-0.6260595,0.7628553,0,0.6343905,-0.7730128,0,0.9951851,0.09801375,0,-0.8819247,0.4713904,0,0.4713897,-0.8819251,0,-0.7730135,0.6343895,0,0.2902988,-0.9569361,0,-0.6343935,0.7730103,0,0.09801918,-0.9951846,0,-0.4713973,0.8819211,0,-0.09801858,-0.9951846,0,-0.2902734,0.9569438,0,-0.2903006,-0.9569355,0,-0.09799396,0.995187,0,-0.4713868,-0.8819267,0,0.09799331,0.9951872,0,-0.634394,-0.7730099,0,0.2902753,0.9569433,0,-0.7730192,-0.6343826,0,-0.8819184,-0.4714021,0,0.9951853,-0.09801232,0,0.6343922,0.7730115,0,-0.9569391,-0.2902888,0,0.7730041,0.6344011,0,-0.9951852,-0.0980134,0,0.8819159,-0.4714067,0,0.881922,0.4713955,0,-0.9951848,0.0980159,0,0.7730225,-0.6343787,-1,-2.05984e-7,0,-1,-2.99158e-7,0,-1,-2.99158e-7,0,-1,1.49566e-7,0,-1,0,0,-1,2.99142e-7,0,-1,2.02014e-7,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,-2.02016e-7,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,0.1615591,0.09673184,-0.9821108,0.1615593,-0.4652045,0.8703352,0.1615592,-0.09673124,-0.9821109,0.1615591,-0.2864601,0.9443725,0.1615588,-0.2864869,-0.9443644,0.1615585,-0.09670668,0.9821134,0.1615588,-0.4651943,-0.8703409,0.1615587,0.09670537,0.9821135,0.1615591,-0.62606,-0.7628549,0.1615592,0.286462,0.9443719,0.1615589,-0.7628649,-0.626048,0.1615588,0.4652332,0.87032,0.1615587,-0.8703329,-0.465209,0.1615588,0.9821117,-0.09672391,0.1615585,0.6260586,0.7628561,0.1615589,-0.9443675,-0.2864763,0.1615588,0.9443692,-0.286471,0.1615588,0.7628496,0.6260666,0.1615589,-0.9821115,-0.09672611,0.1615585,0.8703302,-0.4652144,0.1615587,0.8703357,0.4652037,0.1615589,-0.9821113,0.09672743,0.1615586,0.762867,-0.6260454,0.1615586,0.9443699,0.2864687,0.1615588,-0.9443688,0.2864722,0.161559,0.626057,-0.7628574,0.1615587,0.9821113,0.09672665,0.1615589,-0.8703387,0.4651982,0.1615588,0.4651969,-0.8703394,0.161559,-0.7628585,0.6260557,0.1615588,0.2864852,-0.9443649];
gun.index = [1,0,2,0,0,0,3,1,4,1,2,1,5,2,6,2,4,2,7,3,8,3,6,3,9,4,10,4,8,4,11,5,12,5,10,5,13,6,14,6,12,6,15,7,16,7,14,7,17,8,18,8,16,8,19,9,20,9,18,9,21,10,22,10,20,10,23,11,24,11,22,11,25,12,26,12,24,12,27,13,28,13,26,13,29,14,30,14,28,14,31,15,32,15,30,15,33,16,34,16,32,16,35,17,36,17,34,17,37,18,38,18,36,18,39,19,40,19,38,19,41,20,42,20,40,20,43,21,44,21,42,21,45,22,46,22,44,22,47,23,48,23,46,23,49,24,50,24,48,24,51,25,52,25,50,25,53,26,54,26,52,26,55,27,56,27,54,27,57,28,58,28,56,28,59,29,60,29,58,29,37,30,13,30,5,30,61,31,62,31,60,31,63,32,0,32,62,32,14,33,70,33,12,33,82,34,113,34,81,34,30,35,80,35,79,35,50,36,88,36,48,36,4,37,67,37,66,37,22,38,76,38,75,38,42,39,84,39,40,39,58,40,94,40,93,40,16,41,71,41,14,41,34,42,80,42,32,42,52,43,89,43,50,43,8,44,67,44,6,44,24,45,77,45,76,45,44,46,85,46,42,46,60,47,95,47,94,47,16,48,73,48,72,48,34,49,82,49,81,49,52,50,91,50,90,50,8,51,69,51,68,51,28,52,77,52,26,52,44,53,87,53,86,53,2,54,64,54,0,54,62,55,64,55,95,55,18,56,74,56,73,56,38,57,82,57,36,57,56,58,91,58,54,58,10,59,70,59,69,59,30,60,78,60,28,60,46,61,88,61,87,61,4,62,65,62,2,62,22,63,74,63,20,63,40,64,83,64,38,64,58,65,92,65,56,65,117,66,148,66,116,66,69,67,100,67,68,67,64,68,127,68,95,68,83,69,114,69,82,69,70,70,101,70,69,70,84,71,115,71,83,71,71,72,102,72,70,72,85,73,116,73,84,73,72,74,103,74,71,74,86,75,117,75,85,75,73,76,104,76,72,76,87,77,118,77,86,77,74,78,105,78,73,78,88,79,119,79,87,79,75,80,106,80,74,80,89,81,120,81,88,81,76,82,107,82,75,82,90,83,121,83,89,83,77,84,108,84,76,84,91,85,122,85,90,85,78,86,109,86,77,86,65,87,96,87,64,87,92,88,123,88,91,88,79,89,110,89,78,89,66,90,97,90,65,90,93,91,124,91,92,91,80,92,111,92,79,92,67,93,98,93,66,93,94,94,125,94,93,94,81,95,112,95,80,95,68,96,99,96,67,96,95,97,126,97,94,97,143,98,155,98,159,98,104,99,135,99,103,99,118,100,149,100,117,100,105,101,136,101,104,101,118,102,151,102,150,102,105,103,138,103,137,103,119,104,152,104,151,104,107,105,138,105,106,105,121,106,152,106,120,106,107,107,140,107,139,107,122,108,153,108,121,108,108,109,141,109,140,109,122,110,155,110,154,110,110,111,141,111,109,111,97,112,128,112,96,112,124,113,155,113,123,113,111,114,142,114,110,114,98,115,129,115,97,115,125,116,156,116,124,116,111,117,144,117,143,117,98,118,131,118,130,118,125,119,158,119,157,119,113,120,144,120,112,120,100,121,131,121,99,121,126,122,159,122,158,122,113,123,146,123,145,123,100,124,133,124,132,124,127,125,128,125,159,125,115,126,146,126,114,126,101,127,134,127,133,127,116,128,147,128,115,128,103,129,134,129,102,129,1,130,3,130,2,130,3,131,5,131,4,131,5,132,7,132,6,132,7,133,9,133,8,133,9,134,11,134,10,134,11,135,13,135,12,135,13,136,15,136,14,136,15,137,17,137,16,137,17,138,19,138,18,138,19,139,21,139,20,139,21,140,23,140,22,140,23,141,25,141,24,141,25,142,27,142,26,142,27,143,29,143,28,143,29,144,31,144,30,144,31,145,33,145,32,145,33,146,35,146,34,146,35,147,37,147,36,147,37,148,39,148,38,148,39,149,41,149,40,149,41,150,43,150,42,150,43,21,45,21,44,21,45,151,47,151,46,151,47,152,49,152,48,152,49,153,51,153,50,153,51,154,53,154,52,154,53,155,55,155,54,155,55,156,57,156,56,156,57,157,59,157,58,157,59,158,61,158,60,158,5,159,3,159,61,159,1,160,63,160,61,160,61,30,59,30,53,30,57,30,55,30,53,30,53,30,51,30,49,30,49,30,47,30,53,30,45,30,43,30,37,30,41,30,39,30,37,30,37,30,35,30,33,30,33,30,31,30,37,30,29,161,27,161,25,161,25,30,23,30,29,30,21,162,19,162,17,162,17,163,15,163,21,163,13,30,11,30,5,30,9,164,7,164,5,164,3,30,1,30,61,30,59,30,57,30,53,30,53,30,47,30,45,30,43,30,41,30,37,30,37,165,31,165,29,165,29,166,23,166,21,166,21,30,15,30,13,30,11,167,9,167,5,167,5,30,61,30,37,30,53,30,45,30,37,30,37,30,29,30,21,30,21,30,13,30,37,30,61,30,53,30,37,30,61,168,63,168,62,168,63,169,1,169,0,169,14,170,71,170,70,170,82,171,114,171,113,171,30,172,32,172,80,172,50,173,89,173,88,173,4,174,6,174,67,174,22,175,24,175,76,175,42,176,85,176,84,176,58,177,60,177,94,177,16,178,72,178,71,178,34,179,81,179,80,179,52,180,90,180,89,180,8,181,68,181,67,181,24,182,26,182,77,182,44,183,86,183,85,183,60,184,62,184,95,184,16,185,18,185,73,185,34,186,36,186,82,186,52,187,54,187,91,187,8,188,10,188,69,188,28,189,78,189,77,189,44,190,46,190,87,190,2,191,65,191,64,191,62,192,0,192,64,192,18,193,20,193,74,193,38,194,83,194,82,194,56,195,92,195,91,195,10,196,12,196,70,196,30,197,79,197,78,197,46,198,48,198,88,198,4,199,66,199,65,199,22,200,75,200,74,200,40,201,84,201,83,201,58,202,93,202,92,202,117,203,149,203,148,203,69,204,101,204,100,204,64,205,96,205,127,205,83,206,115,206,114,206,70,207,102,207,101,207,84,208,116,208,115,208,71,209,103,209,102,209,85,210,117,210,116,210,72,211,104,211,103,211,86,212,118,212,117,212,73,213,105,213,104,213,87,214,119,214,118,214,74,215,106,215,105,215,88,216,120,216,119,216,75,217,107,217,106,217,89,218,121,218,120,218,76,219,108,219,107,219,90,220,122,220,121,220,77,221,109,221,108,221,91,85,123,85,122,85,78,222,110,222,109,222,65,223,97,223,96,223,92,224,124,224,123,224,79,225,111,225,110,225,66,90,98,90,97,90,93,226,125,226,124,226,80,227,112,227,111,227,67,228,99,228,98,228,94,229,126,229,125,229,81,230,113,230,112,230,68,231,100,231,99,231,95,97,127,97,126,97,159,232,128,232,131,232,129,98,130,98,131,98,131,98,132,98,133,98,133,98,134,98,131,98,135,98,136,98,137,98,137,98,138,98,135,98,139,98,140,98,141,98,141,98,142,98,143,98,143,233,144,233,145,233,145,234,146,234,147,234,147,98,148,98,149,98,149,235,150,235,151,235,151,236,152,236,143,236,153,98,154,98,155,98,155,98,156,98,159,98,157,237,158,237,159,237,128,238,129,238,131,238,131,239,134,239,135,239,135,240,138,240,139,240,139,241,141,241,135,241,143,242,145,242,151,242,147,243,149,243,151,243,152,98,153,98,155,98,156,244,157,244,159,244,159,245,131,245,143,245,135,246,141,246,143,246,145,98,147,98,151,98,152,247,155,247,143,247,131,248,135,248,143,248,104,249,136,249,135,249,118,250,150,250,149,250,105,251,137,251,136,251,118,252,119,252,151,252,105,253,106,253,138,253,119,254,120,254,152,254,107,255,139,255,138,255,121,256,153,256,152,256,107,257,108,257,140,257,122,258,154,258,153,258,108,259,109,259,141,259,122,260,123,260,155,260,110,261,142,261,141,261,97,262,129,262,128,262,124,263,156,263,155,263,111,264,143,264,142,264,98,265,130,265,129,265,125,266,157,266,156,266,111,267,112,267,144,267,98,268,99,268,131,268,125,269,126,269,158,269,113,270,145,270,144,270,100,271,132,271,131,271,126,272,127,272,159,272,113,273,114,273,146,273,100,274,101,274,133,274,127,275,96,275,128,275,115,276,147,276,146,276,101,277,102,277,134,277,116,278,148,278,147,278,103,279,135,279,134,279];
module.exports.gun = gun;
