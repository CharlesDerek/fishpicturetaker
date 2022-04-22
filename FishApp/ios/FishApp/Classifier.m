#import "Classifier.h"
#import <React/RCTLog.h>

@implementation Classifier

RCT_EXPORT_MODULE();

/*
RCT_EXPORT_METHOD(classify:(NSString *)uri callback:(RCTResponseSenderBlock)callback)
{
  RCTLogInfo(@"Test %s", "name");
  //NSArray *events = ;
  callback(@[[NSNull null], [NSNull null]]);
}
*/

RCT_EXPORT_METHOD(classify:(NSString *) uri
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  //[[Result alloc] initWithClassIndex: 0 confidence: 0.0]
  NSDictionary *dictionary = @{
    @"results": @[ @{ @"class": @"australian_bass", @"confidence": @0.5 } ],
    @"imageUri": uri
  };
  if (dictionary) {
    resolve(dictionary);
  } else {
    reject(@"no_events", @"There were no events", [NSNull null]);
  }
}

@end
