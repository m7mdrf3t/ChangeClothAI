# Troubleshooting Guide - API Error 500

## 🚨 Current Issue: API Error 500 - "Internal server error: try on exception"

### **✅ Good News:**
- API connection is working ✅
- Response format is correct ✅
- Error handling is working ✅
- Your implementation is correct ✅

### **❌ Issue:**
The ChangeClothesAI service is having internal processing errors.

## 🔍 Possible Causes & Solutions

### **1. Image Format Issues**
**Problem**: Images might be in unsupported format or corrupted
**Solutions**:
- Try different image formats (JPG, PNG)
- Ensure images are not corrupted
- Use smaller image files (< 10MB)
- Try images with clear backgrounds

### **2. Image Content Issues**
**Problem**: Images might contain inappropriate content
**Solutions**:
- Use images with clear, appropriate content
- Avoid images with text overlays
- Ensure model is clearly visible
- Use high-quality, well-lit photos

### **3. API Service Issues**
**Problem**: ChangeClothesAI service might be temporarily down
**Solutions**:
- Wait a few minutes and try again
- Check if the service is experiencing high load
- Try during off-peak hours

### **4. Parameter Issues**
**Problem**: Some parameters might be causing processing errors
**Solutions**:
- Try without `garmentDesc` first
- Ensure `category` matches the actual clothing type
- Use simple, clear garment descriptions

## 🧪 Testing Steps

### **Step 1: Test with Simple Images**
1. Use basic, clear photos
2. Try different image combinations
3. Test with smaller file sizes

### **Step 2: Test Different Categories**
1. Try `upper_body` with a simple shirt
2. Try `lower_body` with simple pants
3. Try `dresses` with a simple dress

### **Step 3: Test Without Optional Parameters**
1. Remove `garmentDesc` field
2. Use only required parameters
3. Test with minimal data

### **Step 4: Check API Status**
1. Visit [changeclothesai.online](https://changeclothesai.online)
2. Check if service is operational
3. Look for any maintenance notices

## 📊 Debug Information

### **Current Request:**
- ✅ Endpoint: `/api/openapi/change-clothes-ai`
- ✅ Method: POST
- ✅ Headers: multipart/form-data + Bearer token
- ✅ Parameters: modelImg, garmentImg, category

### **Current Response:**
- ❌ Code: 500
- ❌ Message: "Internal server error: try on exception"
- ✅ Format: Correct API response structure

## 🎯 Next Steps

### **Immediate Actions:**
1. **Try different images** - Use simpler, clearer photos
2. **Test different categories** - Try all three categories
3. **Remove optional parameters** - Test without garmentDesc
4. **Wait and retry** - Service might be temporarily overloaded

### **If Issue Persists:**
1. **Contact ChangeClothesAI support** - Report the 500 error
2. **Check API documentation** - Look for known issues
3. **Monitor service status** - Check for maintenance windows

## 🔧 Technical Details

### **Error Code 500:**
- **Meaning**: Internal server error on ChangeClothesAI side
- **Not your fault**: Your implementation is correct
- **Action needed**: Try different inputs or wait for service recovery

### **"try on exception":**
- **Meaning**: AI processing failed during clothing transformation
- **Common causes**: Image quality, content, or service overload
- **Solutions**: Better images, different timing, or service recovery

## 📞 Support

If the issue persists:
1. **ChangeClothesAI Support**: Contact their support team
2. **API Documentation**: Check for known issues
3. **Service Status**: Monitor for maintenance or outages

Your implementation is working correctly - this is a service-side issue! 🎯
