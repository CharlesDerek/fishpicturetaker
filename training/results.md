2019-04-20
===

Adding ~20 new noisy web classes to the existing hand picked classes, brought val acc down from 92% to 67%. Needless to say, the existing classes had a very bad decrease in performance.  

Classes that had less than 10 noisy web images added, mostly had no change in performance. Some however, greatly went down by -30% and -100%. Looking at the of class size change verse val accuracy change, the majority of the classes decreased in performance. Only a fraction of the classes actually benefited from the noisy web images. This means mixing hand picked images with noisy web images, usually decreases performance.

Looking at 20 new classes with only noisy web data, the majority of them have descent results. With an average class size of 119.3, they got an average validation performance of 42.22%. This is up from the 30.3% val acc of the bigger noisy web dataset. This is good news. This means I can easily add noisy web data to new classes to bootstrap them to begin with, but overtime, as higher quality images are added to the class set, the noisy web images will drag down performance, confusing the neural network.

In conclusion, an abundance of noisy web data is certainly more valuable than nothing, but it is less valuable than high quality data and should not be added to high quality data. This principle may also apply to the hand picked Internet images and the User Images that I will receive over time.

Another aspect of this experiment I haven't investigated is the affect of Fish Not Fish model's false positive and false negative rate. If the FNF model is performance poorly (less than 90% val accuracy), then it may be skewing my results from the noisy web images.

My next plan is to see what happens if I don't add noisy web images to the hand picked images.

After running the new experiment the performance jumped back up to 80.2%. This is still a drop from 92%, but still very good for noisy web images. Looking at the existing 72 images, there were random changes to their performance, but silver jewfish, black jewfish and goldline whiting all had a serious drop in performance.

The new average val acc performance of the original 72 images is 86.2%. This equates to a drop of 6% in performance from adding 34 noisy web classes. Surely adding another 300 noisy web classes will also mean a further drop in performance. 

The noisy web images only classes got an average val accuracy of 56.25%. This is extremely good considering the quality of the images.

This shows that with relatively little effort noisy web images are unreasonably effective. But to be honest, 56.25% is not acceptable for a professional app, it is certainly better than nothing and will help bootstrap Fishpic to become a better app, to attract more users, who share more images, which in terms provides high quality images for Fishpic, which means eventually Fishpic can discard all hand picked and noisy web images completely.

There are further gains to be made from improving the FNF model too.

2019-02-27
===
Training on the the all species dataset with 2719 classes, with a patience of 3, I got these results after 12 + 17 epochs:
loss: 1.9851 - categorical_accuracy: 0.6006 - w_acc: 0.5991 - val_loss: 4.3719 - val_categorical_accuracy: 0.3000 - val_w_acc: 0.2983

With a patience of 8:
loss: 2.0731 - categorical_accuracy: 0.5837 - w_acc: 0.5824 - val_loss: 4.3615 - val_categorical_accuracy: 0.3035 - val_w_acc: 0.3022

This is a very small improvement. It may be statistically negligible.

The average class size of the hand picked dataset is 228.5 images and the average class size of the noisy web images is 49.1. The noisy web model is getting a val acc of 29% because it has a lot less images, the quality of the images poorer, and it has a lot more classes to deal with. Its impressive that its even getting 29% val acc to begin with considering the difficulity the task and the poor quality of the dataset.

With my first run of applying transfer learning to the noisy web model, already the validation performance of the hand picked dataset is better than the training performance. This is bizarre. I've never seen this before.

Setting a patience of 5 gets a val acc of 93.09%.

Trying a batch size of 64: I got an OOM exception. I need more GPU memory.

Comparing Australian Bass and Barramundi between Hand Picked and Noisy Web: Hand Picked did a lot better simply because it had 3 to 8 times as much as data.

2019-02-09
===
I decided to check that the images were being preprocess in the App the same way the images were in the training process. Here are the results of the different App scaling techniques.

Crop left
02-09 19:00:16.099  3764  3866 I ReactNativeJS: [ 'barramundi: 0.9758558',
02-09 19:00:16.099  3764  3866 I ReactNativeJS:   'barred_cheek_coral_trout: 0.9999933',
02-09 19:00:16.099  3764  3866 I ReactNativeJS:   'giant_trevally: 0.9911254',
02-09 19:00:16.099  3764  3866 I ReactNativeJS:   'mahi_mahi: 0.99971896',
02-09 19:00:16.099  3764  3866 I ReactNativeJS:   'wahoo: 0.23947896' ]

Scale ignoring aspect ratio (same technique as training process):
02-09 21:36:10.375  9528  9894 I ReactNativeJS: [ 'barramundi: 0.9992632',
02-09 21:36:10.375  9528  9894 I ReactNativeJS:   'barred_cheek_coral_trout: 0.9999883',
02-09 21:36:10.375  9528  9894 I ReactNativeJS:   'giant_trevally: 0.9999845',
02-09 21:36:10.375  9528  9894 I ReactNativeJS:   'mahi_mahi: 0.99999464',
02-09 21:36:10.375  9528  9894 I ReactNativeJS:   'wahoo: 0.9891685' ]

Naturally preprocessing the images the same way improved performance significantly. This is very good.

Linux model
barramundi (3): 0.9995739
barred_cheek_coral_trout (4): 0.99996233
giant_trevally (20): 0.99993885
mahi_mahi (36): 0.9999963
wahoo (72): 0.9335119

It appears that the App is more or less the same in performance as Linux, but it does significantly better for the Wahoo pic.

2019-01-10
===
Training MobileNet V2 with 110 layers frozen, I got ~85% weighted val acc. This is similar to the performance I get from Inception V3. This is great.

Train Inception V3 new layers first, then all layers:
val categorical accuracy: 0.9491 - val w acc: 0.9211
Best result thus far!
Training the new layers first "synchronizes" them with the existing layers, and then training them all together gets the best performance of all.

Train MobileNet V2 Alpha=1.0 new layers first, then all layers:
val categorical accuracy: 0.9372 - val w acc: 0.9048
Not as good, but almost as good as Inception V3. Maybe with some hyperparameter tuning this can improvement. Its good enough for now.

Nesterov momentum:
val categorical accuracy: 0.9171 - val w acc: 0.8696
Not as good, but not too different.

RMSprop(lr=0.01)
val w acc: 0.05

RMSprop(lr=0.001)
val w acc: 0.25

RMSprop(lr=0.0001)
val w acc: 0.83

2019-01-08
===
Looking at the Keras Applications, MobileNetV2(Alpha=1.4) is one of the best small nets with a size of 6.2M weights, and Xception is one of the best trade off medium nets with a size of 22.9M weights and a Top-1 acc of 79%.

NASNetLarge has the best Top-1 acc of 82.5% with a size of 93.5M weights.

2019-01-05
===
Training Inception v3 in Keras in a similar to manner as to retrain.py, I have achieved 77% val acc in 5 epochs.

Training Inception v3 with retrain.py, I have achieved 68.9% training acc and 75.4% val acc.

Training with Keras:
Extra layer size: n classes
86% val acc
80% weighted val acc.

Extra layer size: n classes * 2
85% val acc

Extra layer size: n classes * 4
81% val acc

Extra layer size: n classes // 2
84% val acc

lr: 0.01
val categorical accuracy: 0.7950 - val w acc: 0.7221

lr: 0.0001
val categorical accuracy: 0.8710 - val w acc: 0.8193

lr: 0.00001
val categorical accuracy: 0.8573 - val w acc: 0.7862

Adding class weights:
val categorical accuracy: 0.8761 - val w acc: 0.8169
Adding class weights did nothing.

SGD: lr: 0.01, mo: 0.9
val acc 0.8875 - val weighted: 0.8353
This has the smallest gap between weighted and normal acc.

SGD: lr: 0.1, mo: 0.9
val categorical accuracy: 0.8229 - val w acc: 0.7593

SGD(lr=0.001, momentum=0.9)
0.8627 - val w acc: 0.8001
Not as good.

SGD(lr=0.01, momentum=0.95)
0.8405 - val w acc: 0.7812
Not as good.

SGD(lr=0.01, momentum=0.85)
0.8917 - val w acc: 0.8416
Best thus far!

SGD(lr=0.01, momentum=0.75)
val categorical accuracy: 0.8845 - val w acc: 0.8280
Not as good.

Repeating this test twice to replicate original excellent results.
SGD(lr=0.01, momentum=0.85)
val categorical accuracy: 0.8791 - val w acc: 0.8209
Desecent but still not as good.

SGD(lr=0.01, momentum=0.65)
val categorical accuracy: 0.8806 - val w acc: 0.8249

top layer train -> all layers train
val categorical accuracy: 0.9126 - val w acc: 0.8690
Best so far. It seems that its best to train the new layer by itself so that its "synced" to the old layers, and then train all layers together. This technique resulted in a circa 2.8% improvement.

top layer train: decay=0.0001
val categorical accuracy: 0.8944 - val w acc: 0.8464
Pretty good.

top layer -> all layers. both with decay
val categorical accuracy: 0.9369 - val w acc: 0.9033
I have achieved my goal finally!

Same settings:
val categorical accuracy: 0.9177 - val w acc: 0.8786
3% less than last time.

patience=4, decay=0.001
val categorical accuracy: 0.9423 - val w acc: 0.9110
Best weighted accuracy eva!

patience=4, decay=0.01
It took too long to finish and the results may never have gotten better than the previous one.

2018-12-29
===
After building a Fish Not Fish dataset out of the Fishpic images and some Open Images images, I fine-tuned the inception model on the FNF dataset and received a validation performance of 96.4%. This is pretty good for a first go, but it is also a relatively simple task.

After using the Fish Not Fish model to filter out not fish images from the all species dataset and then splitting the dataset into training, validation and testing, I ended up with ~1,100 categories and ~77,000 images.

After training Inception v3 on the All Species dataset, it achieved 20.6% val perf. This is descent considering that it has ~1,100 categories.

2018-12-23
===
After reading more about the great benefits of noisy web images, I have looked into my recent results from adding 2681 images to my dataset and only getting a ~1% increase in average class validation performance.

I effectively increased the dataset size by 13.96% and performance only went up ~1%. Initially I thought that this was bad, but the "unresonable effectiveness of noisy web images" white paper, doubling the noisy web dataset size only increased performance by 0.2-1.8%. So my initial performance improvement, whilst woefully inadequate, was actually very good relative to industry standards.

My mediocre performance of 56% may due to the retraining of Inception v3, rather than a lack of quality data.

2018-12-21
===
After reading several white papers and thesises, I have come to learn about several techniques that improved the state of the art performance for fine-grained image classification. Many of these papers use the CUB 200 dataset as their benchmark. The best technique, Spatially Weighting Pooling, achieves 85.2% on the CUB 200 dataset, meanwhile Inception v3 achieves 68.7%. Assuming I have trained Inception to the best of its ability, it appears that SWP is superior at fine-grained image classification. This indicates to me that I should switch models and implement one of these newer models for Fishpic.

Now comparing the Fishpic dataset to CUB 200:
CUB 200:
Classes: 200
Total images: 11,788
Quality: high quality, clear images, good resolution, no other objects featured in images.

Fishpic:
Classes: 82
Total images: ~25,000
Quality: Low-medium quality image, low-medium resolution, some images the fish are partially hidden and there are usually peole and boats in the images.

The fact that Inception is performing better on CUB 200, even though it has more classes and less images is a testament to the higher quality of the CUB dataset. This means that I need to collect more high quality fish images and possibly cull the low quality images that may be dragging down model performance.

It is also possible that Fish images have small inter class differences, making it a harder fine-grained image classification problem to solve.

If Inception v3 gets 56% on Fishpic and 68.7% on CUB 200, then it would suggest that the upper limit of a SWP model would be 85.2% on Fishpic. This is short of my target of 90%, but it is still close.

Reading the thesis about Spatially Weighted Pooling, the author notes:
A large number of images in the dataset are not aligned in terms of the proportion and location of bird objects in the images.

The CUB 200 2011 dataset is of superior quality to the Fishpic dataset, yet the author is criticising the CUB dataset saying that the images have not been normalised in terms of size and location. I infer that the author is suggesting that models will perform better had the CUB images been normalized as such. This would suggest yet another explanation as to why my dataset is of poor quality as the images VASTLY vary in terms of proportion and location. This implies that my original idea to use Yolo to create bounding box images would improve quality as that would help normalize the proportion and location of the fish in the images. 

2018-12-10
===
Manually annotated the shark mackerel images did slightly recover the val performance loss, but ultimately the validation performance is still very low to non-cropped performance.

My theory is that the model is now so confused about species that its getting them more wrong than before. I will see if fixing the lesser queenfish images will improve the shark mackerel performance.

When I improved the lesser queenfish images, the other classes that fluctuated the most up and down were a subset of the classes with 150 images or less. Strangely enough, the avg val perf went up 0.5-0.69% due to the improvements to the lesser queenfish, despite the lesser queenfish improving slightly.

Manually annotating needleskin queenfish did not improve the fish's performance or average class validation accuracy.

2018-12-09
===
Training the inception model on fill cropped images results in no significant improvement over basic cropped images. Ultimately cropped images have decreased average class validation performance by 4%!. My theory is that there are too many poorly cropped images, which are then causing the model to be confused during training as well as getting poor validation performance due to poorly cropped validation images. Hence the adage: garage in, garbage out.

It is worthy noting that fill cropping may be better than basic cropping, but this improvement is likely hidden by the more pressing problem at the moment. It will be worth testing later on after I solve this current problem.

My second hypothesis is that the inception model is performing less than expected due to the lower quality of the cropped images. If all of the cropped images were high quality, I expect that the model's performance would improve dramatically.

I have chosen the Shark Mackerel class to manually fix its images and see if performance improves.
It has a uncropped validation perf. of 62.5% and a fill cropped validation perf. of 25%. If fixing the bounding boxes manually does not recover the decrease in performance of 37.5%, then it would stand to suggest that cropping images isn't helpling, (which would contradict the original barred javelin experiment). Hopefully validation performance will jump up to 80-90% once the bounding boxes are fixed.

2018-11-22
===
Hypothesis: Adding bounding boxes to my dataset and extracting the image of the fish will improve the performance of my model.

3-average of average class validation accuracy for Barred Javelin:
Uncropped images for randomly partioned datasets: 40.48%
Uncropped only for all datasets with same partioning as all other experiments except the beginning ones: 28.57%
Only cropped in all datasets: 76.19%
Uncropped and cropped in all datasets: 47.62%
Uncropped only in training set and cropped in all datasets: 71.43%
Cropped only in training set and uncropped only in validation and testing datasets: 26.19%
Cropped only in training set and uncropped in all datasets: 28.57%

When the model is training only on cropped images, but is tested on uncropped images, performance drops ~2%.
When simply augmenting the training set with cropped images, performance doesn't change.

The best results were obtained when training the model on cropped images (without any uncropped images at all) and then evalulating it's performance on cropped images. This is equivalent to using Yolo in the mobile app. This resulted in a whopping perforance improvement of 47.62%. This is nothing short of amazing, but one caveat is that this result does not reflect the unknown performance of the Yolo network, as the app's performance is then the multiplication of the performance of both networks.

This experiment suggests that adding Yolo to the pipeline will dramatically improve performance. It also reinfornces the lesson that models must be trained on data sources that are as close as possible to the data sources that it will be evaluated on, which ideally are as close as possible to real world usage of the model.

2018-08-15
===
After collecting images for all the low performing classes, I received these results:

Bad results:
The barramundi went up in size 20%, but down in performance by 5%.
The barred cheek coral trout went up in size 27% but down in performance by 11%.
Great barracuda: +17% size, -4% perf.
Longtail tuna: +12% size, -18% perf.
Luderick: +36% size, -0.8% perf.
Pearl perch
Samsonfish
Sea mullet
Silver javelin
Silver jewfish
Snub nosed dart
Tailor
Trumper winter whiting
Wolf herring
Yellowtail kingfish

Strange results:
Cobia: +20% size, +0.05% perf.
Frypan bream: +118% size, +8% pef.

Good results:
Bartailed flathead: +8% size, +16% perf.
Diamondscale mullet: +75% size, +27% perf.
Golden snapper: +19% size, +6% perf.
Goldenline whiting: +41% size, +50 perf.
Grass emperor: +50% size, +11% perf.
King threadfin: +21% size, +31% perf.
Lesser queenfish: +29% size, +20% perf.
Mackerel tuna: +98% size, +14% perf.
Mangrove jack: +12% size, +8% perf.
Northern sand flathead: +66% size, +25% perf.
Spanish mackerel
Teraglin

It seems that most performance gains for a class is at the loss of another class. It is almost a zero sum game.

After adding 2681 new images, average class validation performance only went up from 54.37% to 55.84%.

I do not know what is going on. It may be one or more of the following scenarios:
1. The model does not have the learning capacity to learn much more. This can be checked by training the inception model and seeing if it's baseline performance improves with the new images.
2. The images of the fish are too similar and I need tens of thousands of images to be able to correctly train a neural network to tell the difference between the two.
2. The images of the fish are too similar and so that current CNN models are not able distinguish between the different species.
3. The way images are transformed by the model is making it harder for the model to learn.
4. There could be a bug somewhere in my code.
5. Poor quality images could be confusing the model making it harder to improve performance.

Running the inception model for 300K steps:
INFO:tensorflow:Full training accuracy = 94.3% (N=17497)
INFO:tensorflow:Full validation accuracy = 77.4% (N=2077)
INFO:tensorflow:Average class validation accuracy = 61.2%

Old inception model for 300K steps with some augmentation
INFO:tensorflow:Full training accuracy = 92.9% (N=43651)
INFO:tensorflow:Full validation accuracy = 77.3% (N=1744)
INFO:tensorflow:Average class validation accuracy = 60.9%

The model improved by 0.3% for avg class val perf. The training accuracy went up to 1.4% but probably because there were less images. This means that the inception model with a bigger capacity to learn isn't improving much either. This means that the mobilenet's lack of improvement is not due to a lack of capacity.

After training mobilenet on unique looking images, average class validation performance improved by 8.5%. This means that both the mobilenet, and probably the inception v3 net have troubles classifying very similar pictures. Either this is a limitation of CNNs, or it is actually the model transform problem loosing too much information to help the models distinguish between the different models.

2018-07-30
===
Adding more bing images, the average class validation performance went up from 54.19% to 54.37%.
Pikey bream increased 57% in size, and increased 33% in val class acc. 
School mackerel increased 21% in size and 47% in val class acc.
Spotted mackerel increased 37% in size and 14% in val class acc.
Three by two garfish increased 10% in size and 0% in val class acc.
Trumpeter whiting increased 35% in size and decreased 61% in val class acc.

A significant number of fish lost performance with these new images. The new images took up the associated classes collectively by 0.43%, but we lost performance from other classes, which is why avg class val acc only when up 0.18%.

Creating a graph of val class performance and dataset size, it appears that most images are project to reach 100% acc at 200-700 images. But as we have just seen, performance gains in one class can be partially lost to decreased performance in visually similar classes. So it may take 2-10 times the data to achieve good performance.

2018-07-26
===
The training run with the lowest average val class acc had the best training acc and validation acc strangely enough
Barred queenfish, increased by 42% in size, and 50% in performance.
Bigeye trevally increased by 50% in size and decreased 5.8% in performance.
The very small dataset increased signficantly, but they still had no performance improvements. It appears that performance gains only occur once the dataset hits 20 images.
The swallow tailed dart when from 10 images to 23 (crossing the 20 image threshold) and its val performance went from 0% to 33%.
The average average val class performance when up 1% to 54.19%

The Bing Image search page is proving useful.

2018-07-25
===
After exporting a resized jpeg image from retrain.py, I find that the code simply scales it to the needed dimensions. This means that any image that does not have an aspect ratio of 1:1, will have a strange looking fish. Also, it means that images where the fish takes up a small part of the image, will mean that there is very little data for the model to "see" the fish.

It is probably best to get a bound box model to select the fish, then crop them, and then feed them into the model.

2018-07-22
===
After added more FB photos, average class validation performance dropped to 53.2%.

Here are the class dataset percentage increases and their relative performance:
Australian Bass: 24% size increase, 8.33% perf increase
Barramundi: 7% size increase, 7.33% perf increase
Barred Javelin: 3% size increase, -20.3% perf decrease
Blackspotted rockco: 2% size increase, 19% perf increase
Blue Threadfin: 14% size increase, 16.6% perf increase
Dusky flathead: 5% size increase, 0.9% perf increase
Giant queenfish: 1% size increase, 10% perf increase
Giant trevally: 1% size increase, 8% perf increase
Golden trevally: 1% size increase, 1.5% perf increase
Gold spotted rockcod: 6% size increase, -29% perf decrease

The average performance change for all classes that had new images added was -0.55%. This is very bad.

Why would adding more data decrease the performance of the model?
a. The added data is incorrectly labelled.
b. The added data is poor quality.
c. The model has maxed out it's ability to learn.
d. Adding new images has changed the validation and test sets such that they are harder to pass.
e. The old validation and test performance were not representative of true generalization performance, as when more data was added, the validation and test sets increased in diversity, and consequently the model performed worst (when it was always bad).
f. The pipeline code is cropping the image incorrectly causing it to lose part or all of the image of the fish, or the fish is too small in the 200x200 image that is feed into the model.

Experiements for hypthoses:
a. All of the classes that may have been mislabelled due to new looking fish that I'm not 100% confident about, only pikey bream decreased in performance and that could be due to the it's small dataset size of 39. I don think it's a matter incorrect labels.

b. Most of the added images were big. It's not poor quality data.

c. The only way to test this is to run the Inception v3 model on it's best setting and see if it significantly improves with this new data.

d. The only way to test this is to somehow find a way for the validation and test sets to not change when new images are added. Also, after each set of new FB images are added, if it is the case of the validation and test sets changing, then it should improve. 

e. This is hard to test too.
f. Check what image is put into the model. If it is a poor image, then get a multiple object detection model tocrop the image down to just the fish and see if that improve the training of the model.

Looking at the classes (sizes in parenthesis) that didn't not change in size, but lost performance greater than 10%:
Golden snapper (521) was mistaken as Mangrove jack (877). 
Great barracuda (752) was mistaken as Spanish mackerel (378).
Leaping Bonito (55) was mistaken as Dusky flathead (639).
Needleskin queenfish (75) was mistaken as Spanish mackerel (378).
Samsonfish (272) was mistaken as Golden trevally (604).
Silver jewfish (33) was mistaken as Mangrove jack (877).

In every case but the Great barracuda, the class that didn't change is size but lost performance, lost performance to a dataset that was significantly bigger than it.

I have a theory that as more data is added, the validation performance may improve, but the average class validation performance may decrease strangely enough. This is due to the model actually getting better at fish with a large amount of images, but at the expense of the small classes.


2018-07-21
===
After adding 468 more photos from facebook the average class validation performance went down from 54.9% to 53.9%, a loss of 1%! This isn't good but it could be statistically insignificant.

2 Amberjack images were added but test validation went up 30%. This makes no sense, it's probably because the test dataset for Amberjacks changed.

225 Australian Bass images were added and it went up by 14%.

4 Barred javelin images were added and there was no change.

88 dusky flathead images were added and performance went down 6.78%.

King threadfin images were increased by 10% and performance went up by 13%.


2018-07-15
===
After adding 103 FB images to the dataset, average class validation performance went up from 53.7% to 54.9%, an improvement of 1.2%!

2018-07-12
===
Increasing the sand whiting images by 80% from 81 to 147, increased average validation class accuracy by 4.7% going from 57% to 61.9%. Most of the errors for this class are for tailor fish, which looks similar and has ~600 images. So the bigger number of images is biasing the model towards tailor fish.

2018-06-28
===
Before adding mirror images:
5K steps
---
INFO:tensorflow:Full training accuracy = 86.7% (N=14603)
INFO:tensorflow:Full validation accuracy = 68.1% (N=1744)
INFO:tensorflow:Average class test accuracy = 54.1%

INFO:tensorflow:Full training accuracy = 86.4% (N=14603)
INFO:tensorflow:Full validation accuracy = 67.1% (N=1744)
INFO:tensorflow:Average class test accuracy = 54.0%

INFO:tensorflow:Full training accuracy = 86.3% (N=14603)
INFO:tensorflow:Full validation accuracy = 68.1% (N=1744)
INFO:tensorflow:Average class test accuracy = 54.4%

30K steps
---
INFO:tensorflow:Full training accuracy = 95.7% (N=14603)
INFO:tensorflow:Full validation accuracy = 68.9% (N=1744)
INFO:tensorflow:Average class test accuracy = 51.8%

200K Steps
---
INFO:tensorflow:Full training accuracy = 99.5% (N=14603)
INFO:tensorflow:Full validation accuracy = 69.3% (N=1744)
INFO:tensorflow:Average class validation accuracy = 53.0%

INFO:tensorflow:Full training accuracy = 99.8% (N=14603)
INFO:tensorflow:Full validation accuracy = 68.1% (N=1744)
INFO:tensorflow:Average class validation accuracy = 51.5%


After adding mirror images:
2K steps
---
INFO:tensorflow:Full training accuracy = 80.2% (N=29144)
INFO:tensorflow:Full validation accuracy = 66.8% (N=1744)
INFO:tensorflow:Average class test accuracy = 53.1%

5K steps
---
INFO:tensorflow:Full training accuracy = 83.6% (N=29144)
INFO:tensorflow:Full validation accuracy = 67.4% (N=1744)
INFO:tensorflow:Average class test accuracy = 53.3%

INFO:tensorflow:Full training accuracy = 81.5% (N=29144)
INFO:tensorflow:Full validation accuracy = 66.2% (N=1744)
INFO:tensorflow:Average class test accuracy = 51.1%

10K steps
---
INFO:tensorflow:Full training accuracy = 88.4% (N=29144)
INFO:tensorflow:Full validation accuracy = 68.8% (N=1744)
INFO:tensorflow:Average class test accuracy = 53.3%

20K steps
---
INFO:tensorflow:Full training accuracy = 91.0% (N=29144)
INFO:tensorflow:Full validation accuracy = 68.9% (N=1744)
INFO:tensorflow:Average class test accuracy = 52.5%

After rotating the image 90 degrees:
5K Steps
---
INFO:tensorflow:Full training accuracy = 71.5% (N=29144)
INFO:tensorflow:Full validation accuracy = 63.8% (N=1744)
INFO:tensorflow:Average class test accuracy = 49.3%

INFO:tensorflow:Full training accuracy = 72.5% (N=29144)
INFO:tensorflow:Full validation accuracy = 64.6% (N=1744)
INFO:tensorflow:Average class test accuracy = 49.7%

30K Steps
---
INFO:tensorflow:Full training accuracy = 93.4% (N=29144)
INFO:tensorflow:Full validation accuracy = 68.9% (N=1744)
INFO:tensorflow:Average class test accuracy = 54.2%


After reducing brightness by 50%:
5K Steps
---
INFO:tensorflow:Full training accuracy = 81.8% (N=29144)
INFO:tensorflow:Full validation accuracy = 65.8% (N=1744)
INFO:tensorflow:Average class test accuracy = 52.3%

INFO:tensorflow:Full training accuracy = 82.9% (N=29144)
INFO:tensorflow:Full validation accuracy = 67.8% (N=1744)
INFO:tensorflow:Average class test accuracy = 53.0%

INFO:tensorflow:Full training accuracy = 84.1% (N=29144)
INFO:tensorflow:Full validation accuracy = 67.5% (N=1744)
INFO:tensorflow:Average class test accuracy = 54.5%

20K Steps
---
INFO:tensorflow:Full training accuracy = 89.6% (N=29144)
INFO:tensorflow:Full validation accuracy = 67.1% (N=1744)
INFO:tensorflow:Average class test accuracy = 52.9%

30K steps
---
INFO:tensorflow:Full training accuracy = 93.8% (N=29144)
INFO:tensorflow:Full validation accuracy = 70.1% (N=1744)
INFO:tensorflow:Average class test accuracy = 53.0%

Mobilenet with all 3 augmentation techniques:

500 steps
---
INFO:tensorflow:Full training accuracy = 57.7% (N=58223)
INFO:tensorflow:Full validation accuracy = 57.3% (N=1744)
INFO:tensorflow:Average class validation accuracy = 50.6%

1K Steps
---
INFO:tensorflow:Full training accuracy = 62.5% (N=58223)
INFO:tensorflow:Full validation accuracy = 59.1% (N=1744)
INFO:tensorflow:Average class validation accuracy = 51.2%

5K Steps
---
INFO:tensorflow:Full training accuracy = 75.4% (N=58223)
INFO:tensorflow:Full validation accuracy = 66.8% (N=1744)
INFO:tensorflow:Average class validation accuracy = 53.1%

30K Steps
--
INFO:tensorflow:Full training accuracy = 83.3% (N=58223)
INFO:tensorflow:Full validation accuracy = 69.2% (N=1744)
INFO:tensorflow:Average class test accuracy = 51.0%

60K Steps
---
INFO:tensorflow:Full training accuracy = 85.2% (N=58223)
INFO:tensorflow:Full validation accuracy = 68.9% (N=1744)
INFO:tensorflow:Average class validation accuracy = 53.3%

200K Steps
---
INFO:tensorflow:Full training accuracy = 89.5% (N=58223)
INFO:tensorflow:Full validation accuracy = 69.6% (N=1744)
INFO:tensorflow:Average class validation accuracy = 55.3%


Inception model with reduced brightness:
30K steps
---
INFO:tensorflow:Full training accuracy = 80.1% (N=29144)
INFO:tensorflow:Full validation accuracy = 72.3% (N=1744)
INFO:tensorflow:Average class test accuracy = 55.6%

Mobilenet with mirror, 3 rotations, and 2 brightness augmentations
200K steps
---
INFO:tensorflow:Full training accuracy = 83.4% (N=101849)
INFO:tensorflow:Full validation accuracy = 69.3% (N=1744)
INFO:tensorflow:Average class validation accuracy = 53.5%
 
INFO:tensorflow:Full training accuracy = 83.4% (N=101849)
INFO:tensorflow:Full validation accuracy = 68.1% (N=1744)
INFO:tensorflow:Average class validation accuracy = 52.5%

Mobilenet with 2 brightness augmentations
300K steps
---
INFO:tensorflow:Full training accuracy = 99.4% (N=43651)
INFO:tensorflow:Full validation accuracy = 69.0% (N=1744)
INFO:tensorflow:Average class validation accuracy = 52.6%

Inception model with 2 brightness augmentations
300K steps
---
INFO:tensorflow:Full training accuracy = 92.9% (N=43651)
INFO:tensorflow:Full validation accuracy = 77.3% (N=1744)
INFO:tensorflow:Average class validation accuracy = 60.9%

Notes:

Adding augmented data means you must proportionally increase your training steps as you have effectively increased your training dataset size. Once you training the model sufficiently with the augmented data, it does slighly improve the validation accuracy but at the expense of the average class test accuracy.

My theory is that the classes with small datasets are somehow disadvantaged by data augmentation, but the big classes benefit. This why the validation accuracy goes up, but the average test class accuracy goes down. To further that thought, once all classes are of an "adequate" size, then data augmenation will benefit all classes and improve the average test class accuracy.

Actually adding augmented data does improve the Average class validation accuracy by ~1% when you increasing the training to 30K-200K steps.

Also, when the non-augmented training set is trained on for 200K steps, the training set performance rises to 99%. This shows that the model has the capacity to learn this dataset sufficient. It appears to be just a matter of training technique, augmentation, data quality and dataset size, in order to get the model to truly generalize to an acceptable performance.

The best performance thus far is the Inception model with brightness augmentations trained for 300K steps. This achieved the best validation performance fo 77.3% and 60.9% average class validation accuracy. This is 8% better for validation performance and ~5% better for average class validation accuracy. This may be an indication that the Mobilenet model does not have the capacity to represent all of these images. Looking at a graph of original images per class verses class validation performance, you can see that the average class needs around 500 images to get 100% and the worse case class needs 1100 to get 100%. This is for the inception model training for 300K, which is very different from the Mobilenet model trained for 5K steps.

2018-06-17
===
Manually managing the dataset split was needed to ensure that there was no database bias introduced from using video frames. Before the manual split, using video frames significantly improve the performance of the model, but after the manual split, the video frames are very detrimental to the test performance of the app. They are not generalizing well.

Before split -> After split
Bigeye Trevally: 44.4% -> 5.5%
Cobia: 69.3% -> 44.6%

Video frames appear to be detrimental. Maybe because they are so similar they are inbalancing the fish's dataset and messing everything up. I should try decreasing the number of frames used.

On the plus side, manually splitting the dataset has decreased the volaity of individual class test performance.

2018-06-16
===
Taking a video of cobia from youtube, clipping it down to the frames that contain the fish and exporting the frames and turning the ~500 cobia dataset to ~1250 images, improved performance from 66.6% to 80.08%. An improvement of 14.2%. This improvement may contain data bias as the test set included images from the video frames, which they were very similar to one another. 

2018-06-09
===
Adding 25% more images decreased bartailed flathed performance by 3.7%. That could be stastically insignifant.

Adding 73% more images to dusky flathead improved performance by 10.3%.

Adding 32% more images to grass emperor sweetlip to a total of 82 images, increased performance by 22%.

Adding 46% more images to mahi mahi increasing to a total of 535 images increased performance by 5%.

Adding 43% more images to mangrove jack increasing to a total of 809 images improve performance by 13%.

So adding more images follows the law of diminishing returns.

2018-06-07
===
I removed some bad barred cheek coral trout photos and added some more from a contractor and it went from 58% test acc. to 88.5% test acc. This is awesome. Removing bad images and add more improves the performance of the model.

Removing the misc_fish class improve the average class test accuracy by 1-2% which is good and shows that the misc_fish class is just a source of confusion for the model.

2018-06-05
===
Giant Trevally has a "dataset size" of 611 and it has 92% test acc, and Bigeye Trevally has a "dataset size" of 69 and 7% test acc. I wonder if bigger dataset size for GT is skewing gradient descent in its favour as each training batch is more likely to have a GT image compared to a Bigeye Trevally. And since they look similar the Bigeye Trevally suffers. I should do an experiment to verify this idea.

2018-06-02
===
Removing the misc fish categories caused some fish to jump up from very poor results to good results and a good number of fish to go up by 10%. My guess is that the misc fish must have contained similar species or the exact species and it was confusing the model.

The performance of the barramundi and mangrove jack has been decreasing overtime. It is probably that as we add more fish that look like these two fish, the neural network is decreasing its performance identifying these fish. My theory is that the way to fix this is to add more high quality data to the dataset and that will hopefully push the performance of these fish up.

2018-05-30
===
INFO:tensorflow:Final test accuracy = 60.9% (N=1547)
class amberjack correct: 26/73 (35.6%)
class australian bass correct: 28/52 (53.8%)
class australian bonito correct: 4/11 (36.4%)
class barramundi correct: 29/44 (65.9%)
class barred cheek coral trout correct: 11/16 (68.8%)
class barred javelin correct: 7/24 (29.2%)
class barred queenfish correct: 0/1 (0.0%)
class bartailed flathead correct: 6/12 (50.0%)
class beach correct: 1/2 (50.0%)
class bigeye trevally correct: 0/10 (0.0%)
class black jewfish correct: 10/51 (19.6%)
class blackbanded amberjack correct: 3/7 (42.9%)
class blackspotted rockcod correct: 4/8 (50.0%)
class blue threadfin correct: 3/6 (50.0%)
class boat correct: 3/4 (75.0%)
class cobia correct: 31/43 (72.1%)
class diamondscale mullet correct: 4/9 (44.4%)
class dusky flathead correct: 14/24 (58.3%)
class frypan bream correct: 1/1 (100.0%)
class giant queenfish correct: 13/22 (59.1%)
class giant trevally correct: 48/59 (81.4%)
class golden snapper fingermark correct: 32/39 (82.1%)
class golden trevally correct: 35/40 (87.5%)
class goldspotted rockcod correct: 4/10 (40.0%)
class grass emperor sweetlip correct: 2/4 (50.0%)
class great barracuda correct: 60/91 (65.9%)
class grey mackerel correct: 1/3 (33.3%)
class highfin amberjack correct: 7/22 (31.8%)
class king threadfin correct: 4/15 (26.7%)
class leaping bonito correct: 1/6 (16.7%)
class lesser queenfish correct: 5/14 (35.7%)
class longtail tuna correct: 8/20 (40.0%)
class luderick correct: 21/26 (80.8%)
class mackerel tuna correct: 11/39 (28.2%)
class mahi mahi correct: 32/37 (86.5%)
class mangrove jack correct: 38/43 (88.4%)
class misc fish correct: 138/159 (86.8%)
class mulloway correct: 5/11 (45.5%)
class needleskin queenfish correct: 6/9 (66.7%)
class northern sand flathead correct: 1/3 (33.3%)
class pearl perch correct: 13/23 (56.5%)
class people correct: 1/5 (20.0%)
class pikey bream correct: 1/4 (25.0%)
class river correct: 24/26 (92.3%)
class river garfish correct: 0/0 (0.0%)
class river perch correct: 0/0 (0.0%)
class samsonfish correct: 6/9 (66.7%)
class scaly jewfish correct: 0/0 (0.0%)
class school mackerel correct: 0/1 (0.0%)
class scribbled rabbitfish correct: 8/10 (80.0%)
class sea correct: 4/5 (80.0%)
class sea mullet correct: 12/22 (54.5%)
class shark mackerel correct: 3/4 (75.0%)
class silver javelin correct: 0/0 (0.0%)
class silver jewfish correct: 3/4 (75.0%)
class snapper correct: 37/60 (61.7%)
class snub nosed dart correct: 36/41 (87.8%)
class snubnose garfish correct: 0/1 (0.0%)
class spanish mackerel correct: 21/52 (40.4%)
class spotted mackerel correct: 3/12 (25.0%)
class striped barracuda correct: 3/7 (42.9%)
class tailor correct: 33/71 (46.5%)
class tarwhine correct: 2/3 (66.7%)
class teraglin correct: 2/5 (40.0%)
class three by two garfish correct: 0/1 (0.0%)
class wahoo correct: 11/20 (55.0%)
class yellowfin bream correct: 7/14 (50.0%)
class yellowfin tuna correct: 29/46 (63.0%)
class yellowtail kingfish correct: 26/30 (86.7%)
class yellowtailed flathead correct: 0/1 (0.0%)

INFO:tensorflow:Final test accuracy = 59.0% (N=1547)
class amberjack correct: 26/95 (27.4%)
class australian bass correct: 30/46 (65.2%)
class australian bonito correct: 4/9 (44.4%)
class barramundi correct: 33/53 (62.3%)
class barred cheek coral trout correct: 13/37 (35.1%)
class barred javelin correct: 4/14 (28.6%)
class barred queenfish correct: 0/2 (0.0%)
class bartailed flathead correct: 4/9 (44.4%)
class beach correct: 1/2 (50.0%)
class bigeye trevally correct: 0/15 (0.0%)
class black jewfish correct: 3/9 (33.3%)
class blackbanded amberjack correct: 3/7 (42.9%)
class blackspotted rockcod correct: 3/7 (42.9%)
class blue threadfin correct: 5/9 (55.6%)
class boat correct: 3/5 (60.0%)
class cobia correct: 33/58 (56.9%)
class diamondscale mullet correct: 4/5 (80.0%)
class dusky flathead correct: 17/33 (51.5%)
class frypan bream correct: 1/2 (50.0%)
class giant queenfish correct: 13/28 (46.4%)
class giant trevally correct: 42/46 (91.3%)
class golden snapper fingermark correct: 38/60 (63.3%)
class golden trevally correct: 45/61 (73.8%)
class goldspotted rockcod correct: 4/12 (33.3%)
class grass emperor sweetlip correct: 4/7 (57.1%)
class great barracuda correct: 55/65 (84.6%)
class grey mackerel correct: 1/5 (20.0%)
class highfin amberjack correct: 4/6 (66.7%)
class king threadfin correct: 3/11 (27.3%)
class leaping bonito correct: 2/5 (40.0%)
class lesser queenfish correct: 3/11 (27.3%)
class longtail tuna correct: 7/26 (26.9%)
class luderick correct: 20/28 (71.4%)
class mackerel tuna correct: 12/38 (31.6%)
class mahi mahi correct: 29/33 (87.9%)
class mangrove jack correct: 50/65 (76.9%)
class misc fish correct: 109/121 (90.1%)
class mulloway correct: 10/22 (45.5%)
class needleskin queenfish correct: 6/7 (85.7%)
class northern sand flathead correct: 1/2 (50.0%)
class pearl perch correct: 9/15 (60.0%)
class people correct: 0/3 (0.0%)
class pikey bream correct: 2/5 (40.0%)
class river correct: 22/24 (91.7%)
class river garfish correct: 0/2 (0.0%)
class river perch correct: 0/0 (0.0%)
class samsonfish correct: 9/20 (45.0%)
class scaly jewfish correct: 0/0 (0.0%)
class school mackerel correct: 1/6 (16.7%)
class scribbled rabbitfish correct: 8/10 (80.0%)
class sea correct: 4/6 (66.7%)
class sea mullet correct: 11/20 (55.0%)
class shark mackerel correct: 3/12 (25.0%)
class silver javelin correct: 1/2 (50.0%)
class silver jewfish correct: 2/3 (66.7%)
class snapper correct: 34/53 (64.2%)
class snub nosed dart correct: 33/41 (80.5%)
class snubnose garfish correct: 0/0 (0.0%)
class spanish mackerel correct: 14/36 (38.9%)
class spotted mackerel correct: 2/15 (13.3%)
class striped barracuda correct: 4/9 (44.4%)
class tailor correct: 24/38 (63.2%)
class tarwhine correct: 2/3 (66.7%)
class teraglin correct: 2/8 (25.0%)
class three by two garfish correct: 0/1 (0.0%)
class wahoo correct: 13/29 (44.8%)
class yellowfin bream correct: 10/29 (34.5%)
class yellowfin tuna correct: 26/44 (59.1%)
class yellowtail kingfish correct: 31/37 (83.8%)
class yellowtailed flathead correct: 0/0 (0.0%)

2018-05-06
===
INFO:tensorflow:Final test accuracy = 69.3% (N=1097)
class australian bass correct: 27/36 (75.0%)
class barramundi correct: 32/35 (91.4%)
class barred cheek coral trout correct: 11/15 (73.3%)
class bartailed flathead correct: 6/11 (54.5%)
class beach correct: 1/2 (50.0%)
class boat correct: 2/3 (66.7%)
class cobia correct: 30/33 (90.9%)
class diamondscale mullet correct: 3/3 (100.0%)
class dusky flathead correct: 16/31 (51.6%)
class golden trevally correct: 46/54 (85.2%)
class great barracuda correct: 56/71 (78.9%)
class lesser queenfish correct: 4/6 (66.7%)
class longtail tuna correct: 36/123 (29.3%)
class luderick correct: 19/27 (70.4%)
class mahi mahi correct: 36/47 (76.6%)
class mangrove jack correct: 61/72 (84.7%)
class misc fish correct: 163/188 (86.7%)
class needleskin queenfish correct: 7/8 (87.5%)
class northern sand flathead correct: 1/2 (50.0%)
class pearl perch correct: 13/16 (81.2%)
class people correct: 1/6 (16.7%)
class river correct: 23/24 (95.8%)
class river garfish correct: 0/0 (0.0%)
class school mackerel correct: 1/1 (100.0%)
class scribbled rabbitfish correct: 7/9 (77.8%)
class sea correct: 4/7 (57.1%)
class sea mullet correct: 15/49 (30.6%)
class snub nosed dart correct: 34/40 (85.0%)
class snubnose garfish correct: 0/1 (0.0%)
class spanish mackerel correct: 11/22 (50.0%)
class spotted mackerel correct: 4/12 (33.3%)
class striped barracuda correct: 4/8 (50.0%)
class tailor correct: 26/44 (59.1%)
class three by two garfish correct: 0/1 (0.0%)
class wahoo correct: 16/32 (50.0%)
class yellowfin tuna correct: 9/10 (90.0%)
class yellowtail kingfish correct: 35/47 (74.5%)
class yellowtailed flathead correct: 0/1 (0.0%)

INFO:tensorflow:Final test accuracy = 69.3% (N=1097)
class australian bass correct: 24/31 (77.4%)
class barramundi correct: 42/95 (44.2%)
class barred cheek coral trout correct: 11/17 (64.7%)
class bartailed flathead correct: 8/15 (53.3%)
class beach correct: 1/1 (100.0%)
class boat correct: 2/4 (50.0%)
class cobia correct: 33/46 (71.7%)
class diamondscale mullet correct: 3/4 (75.0%)
class dusky flathead correct: 14/25 (56.0%)
class golden trevally correct: 45/58 (77.6%)
class great barracuda correct: 57/63 (90.5%)
class lesser queenfish correct: 2/4 (50.0%)
class longtail tuna correct: 21/47 (44.7%)
class luderick correct: 18/31 (58.1%)
class mahi mahi correct: 38/53 (71.7%)
class mangrove jack correct: 60/71 (84.5%)
class misc fish correct: 158/177 (89.3%)
class needleskin queenfish correct: 8/10 (80.0%)
class northern sand flathead correct: 1/1 (100.0%)
class pearl perch correct: 11/15 (73.3%)
class people correct: 1/3 (33.3%)
class river correct: 25/27 (92.6%)
class river garfish correct: 0/1 (0.0%)
class school mackerel correct: 1/1 (100.0%)
class scribbled rabbitfish correct: 8/11 (72.7%)
class sea correct: 4/6 (66.7%)
class sea mullet correct: 9/16 (56.2%)
class snub nosed dart correct: 33/37 (89.2%)
class snubnose garfish correct: 0/1 (0.0%)
class spanish mackerel correct: 18/42 (42.9%)
class spotted mackerel correct: 2/17 (11.8%)
class striped barracuda correct: 4/7 (57.1%)
class tailor correct: 15/25 (60.0%)
class three by two garfish correct: 0/1 (0.0%)
class wahoo correct: 9/18 (50.0%)
class yellowfin tuna correct: 22/28 (78.6%)
class yellowtail kingfish correct: 52/87 (59.8%)
class yellowtailed flathead correct: 0/1 (0.0%)


2018-04-28
===
INFO:tensorflow:Final test accuracy = 74.6% (N=823)
class australian bass correct: 32/43 (74.4%)
class barramundi correct: 35/48 (72.9%)
class barred cheek coral trout correct: 11/12 (91.7%)
class bartailed flathead correct: 7/13 (53.8%)
class beach correct: 1/3 (33.3%)
class boat correct: 1/2 (50.0%)
class cobia correct: 32/42 (76.2%)
class diamondscale mullet correct: 3/4 (75.0%)
class dusky flathead correct: 15/26 (57.7%)
class great barracuda correct: 56/64 (87.5%)
class longtail tuna correct: 17/23 (73.9%)
class luderick correct: 19/26 (73.1%)
class mahi mahi correct: 32/35 (91.4%)
class mangrove jack correct: 55/61 (90.2%)
class misc fish correct: 174/200 (87.0%)
class northern sand flathead correct: 1/2 (50.0%)
class people correct: 1/6 (16.7%)
class river correct: 23/24 (95.8%)
class river garfish correct: 0/0 (0.0%)
class school mackerel correct: 0/1 (0.0%)
class scribbled rabbitfish correct: 8/10 (80.0%)
class sea correct: 4/7 (57.1%)
class sea mullet correct: 11/17 (64.7%)
class snubnose garfish correct: 0/1 (0.0%)
class spanish mackerel correct: 23/53 (43.4%)
class striped barracuda correct: 3/6 (50.0%)
class three by two garfish correct: 0/1 (0.0%)
class wahoo correct: 11/20 (55.0%)
class yellowfin tuna correct: 39/72 (54.2%)
class yellowtailed flathead correct: 0/1 (0.0%)

INFO:tensorflow:Final test accuracy = 77.1% (N=814)
class australian bass correct: 30/40 (75.0%)
class barramundi correct: 34/46 (73.9%)
class barred cheek coral trout correct: 12/16 (75.0%)
class bartailed flathead correct: 6/12 (50.0%)
class beach correct: 1/1 (100.0%)
class boat correct: 4/6 (66.7%)
class cobia correct: 35/48 (72.9%)
class diamondscale mullet correct: 3/4 (75.0%)
class dusky flathead correct: 17/26 (65.4%)
class great barracuda correct: 56/60 (93.3%)
class longtail tuna correct: 23/31 (74.2%)
class luderick correct: 21/32 (65.6%)
class mahi mahi correct: 35/41 (85.4%)
class mangrove jack correct: 58/62 (93.5%)
class misc fish correct: 170/192 (88.5%)
class northern sand flathead correct: 1/3 (33.3%)
class people correct: 1/3 (33.3%)
class river correct: 25/26 (96.2%)
class river garfish correct: 0/0 (0.0%)
class school mackerel correct: 1/2 (50.0%)
class sea correct: 4/5 (80.0%)
class sea mullet correct: 14/25 (56.0%)
class snubnose garfish correct: 0/0 (0.0%)
class spanish mackerel correct: 25/52 (48.1%)
class striped barracuda correct: 6/9 (66.7%)
class three by two garfish correct: 0/1 (0.0%)
class wahoo correct: 11/18 (61.1%)
class yellowfin tuna correct: 35/53 (66.0%)
class yellowtailed flathead correct: 0/0 (0.0%)

INFO:tensorflow:Final test accuracy = 76.3% (N=814)
class australian bass correct: 28/36 77.8%
class barramundi correct: 36/51 70.6%
class barred cheek coral trout correct: 14/16 87.5%
class bartailed flathead correct: 7/12 58.3%
class beach correct: 1/1 100.0%
class boat correct: 3/4 75.0%
class cobia correct: 36/49 73.5%
class diamondscale mullet correct: 3/4 75.0%
class dusky flathead correct: 16/30 53.3%
class great barracuda correct: 57/63 90.5%
class longtail tuna correct: 27/44 61.4%
class luderick correct: 20/27 74.1%
class mahi mahi correct: 37/44 84.1%
class mangrove jack correct: 53/59 89.8%
class misc fish correct: 171/191 89.5%
class northern sand flathead correct: 1/2 50.0%
class people correct: 1/4 25.0%
class river correct: 23/24 95.8%
class river garfish correct: 0/0 0.0%
class school mackerel correct: 0/0 0.0%
class sea correct: 4/7 57.1%
class sea mullet correct: 13/17 76.5%
class snubnose garfish correct: 0/0 0.0%
class spanish mackerel correct: 21/50 42.0%
class striped barracuda correct: 5/9 55.6%
class three by two garfish correct: 0/1 0.0%
class wahoo correct: 10/16 62.5%
class yellowfin tuna correct: 34/52 65.4%
class yellowtailed flathead correct: 0/1 0.0%

2018-04-02
===
Mobile net training.
INFO:tensorflow:Final test accuracy = 63.7% (N=901)
class barramundi correct: 37/47
class mangrove jack correct: 45/47

INFO:tensorflow:Final test accuracy = 63.5% (N=901)
class barramundi correct: 43/58
class mangrove jack correct: 38/38

2018-03-29
===
Aftering writing the react native module for classifying the image, we receive a considerable performance compared to the the TF demo native android app:
React native using react native tf library: 0.8-1.0 GB of RAM when classifying and it took 23 seconds to classify image.
Native demo app: 300 Meg and 1 seconds to classify image.
React native modules: 320-425 Meg resting memory after classification. Once the model is loaded, the model takes ~700ms to classify the image.

2018-03-17
===
Running the inceptionv3 model over all of the barramundi images (which is a bad idea because this mixes the training set with the test set), most correctly label images ranged from 1-2% confidence. Most of the correct images were trophy images. Most of the incorrect images either had a watermark in the image, or were cartoon depictions of barramundi.

My hypothesis is that the classifier is actually overfitting the trophy images to identify barramundi, as they are the only fish in all of the trophy photos. My plan is to another fish to classify to see if it decreases performance. 

Currently barramundi test before ranges in 85-95% correctness.

Training inception v3 model with mangrove_jack images:

First run:
test training accuracy: 34.6%
barramundi: 24/25 (96%)
mangrove_jack: 44/54 (81%)

Second run:
test training accuracy: 34.1%
barramundi: 25/33 (75%)
mangrove_jack: 36/41 (87%)

Third run:
test training accuracy: 32.5%
barramundi: N/A
mangrove_jack: 49/79 49/79 (62%)

Fourth run:
test training accuracy: 33.7%
barramundi: 22/26 (84%)
mangrove_jack: 40/48 (83%)

Barramundi test results have gone from an average of ~90% down to an average of 85%. Mangrove jack test results average 78%. These are OK results and the fact that Barramundi have gone down by 5% shows that the trophy image background image features.

Running the model on an android phone pointing at a monitor with the dataset images gives an 80% accuracy rating of the right fish. It isn't perfect, but it works.

2018-03-03
===
Running the Inception v3 stipped model on the Motorala pointing at a picture of a barramundi on a monitor gave a top 1 confidence of ~1.9%, which seem pretty low.

Testing the same model on my Linx machine using the follow photos:
original photo: 2.6%
phone photos: ~1-2.4%

Testing other barramundi images that were apart of the train/val/test dataset proved to received confidences in the range of ~1-2% as well.

It appears that the model is correctly identifying pictures of barramundi but with extremely low confidence levels. It could be because the model is poorly trained because clear photos of barramundi are receiving very low confidence levels.

I all attempt to train the model again with more higher quality photos.

## Performance
### QUT_fish_data + Barramundi
Current test accuracy: 37.5%.

barramundi test results
====
6 / 6

12 / 12

17 / 20

16 / 17

17 / 20

### QUT_fish_data + Barramundi + no fish
Current test accuracy: 39.1%.

barramundi test results
====
17 / 18

17 / 19

16 / 17


#### Mobile net results
Test accuracy: 67.8%
But Barramundi results was 21 / 25

67.9%
Barramuni results 20 / 23

It seems that the Mobile net is performing a lot better for the fish classes of which we have less than 7 images per class, but its not performing as strongly for the Barramundi class which we care about the most, with an average of ~85% test accuracy, compared to ~92.5% accuracy of the Inveception v3 model.

#### Mobile net quantized results
test accuracy = 63.6% (N=819)
class barramundi correct: 21/26

Final test accuracy = 65.4% (N=819)
class barramundi correct: 21/23
